const fs = require('fs/promises');
const path = require('path');
const normalizePhone = require('../utils/phone');

const projectRoot = path.join(__dirname, '../../../');
const sampleFile = path.join(projectRoot, 'data/sample/tickets.csv');
const batchSize = 500;

function parseCsv(content) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    if (quoted) {
      if (character === '"' && content[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"' && value.length === 0) {
      quoted = true;
    } else if (character === ',') {
      row.push(value);
      value = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && content[index + 1] === '\n') index += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error('CSV contains an unterminated quoted field');
  if (value.length > 0 || row.length > 0) {
    row.push(value);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }
  if (!rows.length) return [];

  const headers = rows.shift().map((header, index) => (
    index === 0 ? header.replace(/^\uFEFF/, '') : header
  ));
  return rows.map((cells, rowIndex) => {
    if (cells.length !== headers.length) {
      throw new Error(`CSV row ${rowIndex + 2} has ${cells.length} fields; expected ${headers.length}`);
    }
    return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
  });
}

async function readCsv(filePath) {
  return parseCsv(await fs.readFile(filePath, 'utf8'));
}

function requireColumns(rows, fileName, columns) {
  if (!rows.length) throw new Error(`${fileName} is empty`);
  for (const column of columns) {
    if (!Object.hasOwn(rows[0], column)) {
      throw new Error(`${fileName} is missing the required column "${column}"`);
    }
  }
}

function normalizeTicketRow(row, rowNumber) {
  const customerPhone = normalizePhone(row.customer_phone);
  if (!customerPhone || customerPhone.length < 7 || customerPhone.length > 15) {
    return null;
  }
  const required = ['center_name', 'address', 'ticket_code', 'customer_name', 'device_model', 'status', 'received_at'];
  for (const field of required) {
    if (!String(row[field] || '').trim()) {
      throw new Error(`Dataset ticket row ${rowNumber} is missing "${field}"`);
    }
  }
  if (row.ticket_code.length > 20 || row.customer_name.length > 100 || row.device_model.length > 100) {
    throw new Error(`Dataset ticket row ${rowNumber} exceeds a database field limit`);
  }
  return {
    ...row,
    customer_phone: customerPhone,
    received_at: row.received_at.trim()
  };
}

function buildFullDatasetRows(dataset) {
  const customers = new Map(dataset.customers.map((row) => [row.record_id, row]));
  const products = new Map(dataset.products.map((row) => [row.product_id, row]));
  const centers = new Map(dataset.centers.map((row) => [row.center_id, row]));
  const ticketsById = new Map();
  const ticketRows = dataset.tickets.map((ticket, index) => {
    const customer = customers.get(ticket.customer_id);
    const product = products.get(ticket.product_id);
    const center = centers.get(ticket.center_id);
    if (!customer || !product || !center) {
      throw new Error(`Dataset ticket ${ticket.ticket_code} has a missing customer, product, or service center`);
    }
    const normalized = normalizeTicketRow({
      center_name: center.center_name,
      address: center.thanh_pho,
      ticket_code: ticket.ticket_code,
      customer_name: customer.ho_ten,
      customer_phone: customer.so_dien_thoai,
      device_model: product.product_name,
      status: ticket.status,
      received_at: ticket.received_at
    }, index + 2);
    ticketsById.set(ticket.ticket_id, { ticket, normalized });
    return normalized;
  }).filter(Boolean);

  const responses = [];
  for (const response of dataset.surveys) {
    const linked = ticketsById.get(response.ticket_id);
    if (!linked || !linked.normalized
      || !['DA_DONG', 'HOAN_TAT', 'CLOSED', 'RESOLVED', 'COMPLETED'].includes(linked.ticket.status.toUpperCase())) {
      continue;
    }
    const score = Number(response.score);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw new Error(`Dataset response ${response.response_id} has an invalid CSAT score`);
    }
    responses.push({
      ticket_code: linked.ticket.ticket_code,
      csat_score: score,
      feedback_content: response.comment || '',
      responded_at: response.responded_at
    });
  }
  const responsesByTicketCode = new Map(responses.map((response) => [response.ticket_code, response]));
  return {
    ticketRows: ticketRows.map((ticket) => ({
      ...ticket,
      ...(responsesByTicketCode.get(ticket.ticket_code) || {})
    })),
    responses,
    ticketsSkippedMissingPhone: dataset.tickets.length - ticketRows.length,
    surveyResponsesSkipped: dataset.surveys.length - responses.length
  };
}

async function insertRows(client, table, columns, rows, conflictClause) {
  let inserted = 0;
  for (let offset = 0; offset < rows.length; offset += batchSize) {
    const batch = rows.slice(offset, offset + batchSize);
    const values = [];
    const tuples = batch.map((row, rowIndex) => {
      const placeholders = columns.map((column, columnIndex) => {
        values.push(row[column]);
        return `$${rowIndex * columns.length + columnIndex + 1}`;
      });
      return `(${placeholders.join(', ')})`;
    });
    const result = await client.query(
      `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${tuples.join(', ')} ${conflictClause}`,
      values
    );
    inserted += result.rowCount;
  }
  return inserted;
}

async function insertSurveyRows(client, responses) {
  let inserted = 0;
  const columns = ['ticket_code', 'csat_score', 'feedback_content', 'responded_at'];
  for (let offset = 0; offset < responses.length; offset += batchSize) {
    const batch = responses.slice(offset, offset + batchSize);
    const values = [];
    const tuples = batch.map((response, rowIndex) => {
      const placeholders = columns.map((column, columnIndex) => {
        values.push(response[column]);
        return `$${rowIndex * columns.length + columnIndex + 1}`;
      });
      return `(${placeholders.join(', ')})`;
    });
    const result = await client.query(
      `INSERT INTO survey_ticket (ticket_id, csat_score, nps_score, feedback_content, created_at)
       SELECT ticket.ticket_id, source.csat_score::SMALLINT, NULL, source.feedback_content, source.responded_at::TIMESTAMP
       FROM (VALUES ${tuples.join(', ')}) AS source(ticket_code, csat_score, feedback_content, responded_at)
       JOIN ticket ON ticket.ticket_code = source.ticket_code
       WHERE UPPER(ticket.status) IN ('HOAN_TAT', 'DA_DONG', 'CLOSED', 'RESOLVED', 'COMPLETED')
       ON CONFLICT (ticket_id) DO NOTHING`,
      values
    );
    inserted += result.rowCount;
  }
  return inserted;
}

async function importRows(client, rawRows, {
  ticketsRead = rawRows.length,
  ticketsSkippedMissingPhone = 0,
  surveyResponsesSkipped = 0
} = {}) {
  const ticketRows = [];
  let skippedMissingPhone = 0;
  for (let index = 0; index < rawRows.length; index += 1) {
    const row = normalizeTicketRow(rawRows[index], index + 2);
    if (!row) {
      skippedMissingPhone += 1;
    } else {
      ticketRows.push(row);
    }
  }

  const centers = new Map();
  for (const ticket of ticketRows) {
    centers.set(ticket.center_name, ticket.address);
  }
  await insertRows(
    client,
    'service_center',
    ['center_name', 'address'],
    [...centers].map(([center_name, address]) => ({ center_name, address })),
    'ON CONFLICT (center_name) DO NOTHING'
  );
  const result = await client.query(
    'SELECT center_id, center_name FROM service_center WHERE center_name = ANY($1)',
    [[...centers.keys()]]
  );
  const centerIds = new Map(result.rows.map((row) => [row.center_name, row.center_id]));

  const ticketsToInsert = ticketRows.map((ticket) => ({
    center_id: centerIds.get(ticket.center_name),
    ticket_code: ticket.ticket_code,
    customer_name: ticket.customer_name,
    customer_phone: ticket.customer_phone,
    device_model: ticket.device_model,
    status: ticket.status,
    created_at: ticket.received_at
  }));
  const insertedTickets = await insertRows(
    client,
    'ticket',
    ['center_id', 'ticket_code', 'customer_name', 'customer_phone', 'device_model', 'status', 'created_at'],
    ticketsToInsert,
    'ON CONFLICT (ticket_code) DO NOTHING'
  );

  const responses = [];
  for (const row of ticketRows) {
    const score = Number(row.csat_score);
    if (row.csat_score === undefined || row.csat_score === '') continue;
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw new Error(`Dataset response for ticket ${row.ticket_code} has an invalid CSAT score`);
    }
    if (row.feedback_content.length > 500) {
      throw new Error(`Dataset response for ticket ${row.ticket_code} exceeds 500 characters`);
    }
    responses.push({
      ticket_code: row.ticket_code,
      csat_score: score,
      feedback_content: row.feedback_content || '',
      responded_at: row.responded_at || row.received_at
    });
  }
  const insertedResponses = await insertSurveyRows(client, responses);

  return {
    serviceCenters: centers.size,
    ticketsRead,
    ticketsImported: insertedTickets,
    surveysRead: responses.length,
    surveysImported: insertedResponses,
    ticketsSkippedMissingPhone: ticketsSkippedMissingPhone + skippedMissingPhone,
    surveyResponsesSkipped
  };
}

async function importSampleDataset(client) {
  const rows = await readCsv(sampleFile);
  requireColumns(rows, 'data/sample/tickets.csv', [
    'center_name', 'address', 'ticket_code', 'customer_name', 'customer_phone',
    'device_model', 'status', 'received_at', 'csat_score', 'feedback_content', 'responded_at'
  ]);
  return importRows(client, rows);
}

async function importFullDataset(client, datasetDirectory) {
  const files = {
    centers: 'service_centers.csv',
    tickets: 'tickets_history.csv',
    surveys: 'survey_responses.csv',
    customers: 'customers_raw.csv',
    products: 'products.csv'
  };
  const dataset = {};
  for (const [key, fileName] of Object.entries(files)) {
    dataset[key] = await readCsv(path.join(datasetDirectory, fileName));
    if (!dataset[key].length) throw new Error(`${fileName} is empty or missing`);
  }
  requireColumns(dataset.centers, files.centers, ['center_id', 'center_name', 'thanh_pho']);
  requireColumns(dataset.tickets, files.tickets, [
    'ticket_id', 'ticket_code', 'customer_id', 'product_id', 'center_id', 'status', 'received_at'
  ]);
  requireColumns(dataset.surveys, files.surveys, ['response_id', 'ticket_id', 'score', 'comment', 'responded_at']);
  requireColumns(dataset.customers, files.customers, ['record_id', 'ho_ten', 'so_dien_thoai']);
  requireColumns(dataset.products, files.products, ['product_id', 'product_name']);

  const { ticketRows, ticketsSkippedMissingPhone, surveyResponsesSkipped } = buildFullDatasetRows(dataset);
  return importRows(client, ticketRows, {
    ticketsRead: dataset.tickets.length,
    ticketsSkippedMissingPhone,
    surveyResponsesSkipped
  });
}

module.exports = {
  buildFullDatasetRows,
  importFullDataset,
  importSampleDataset,
  normalizeTicketRow,
  parseCsv
};
