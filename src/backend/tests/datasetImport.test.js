const fs = require('fs');
const path = require('path');
const {
  buildFullDatasetRows,
  normalizeTicketRow,
  parseCsv
} = require('../scripts/datasetImport');

describe('dataset import helpers', () => {
  test('parses escaped quotes, commas, and newlines in CSV fields', () => {
    expect(parseCsv('\uFEFFname,comment\r\nMekong,"Dịch vụ, ""rất tốt""\nCảm ơn"\r\n')).toEqual([
      { name: 'Mekong', comment: 'Dịch vụ, "rất tốt"\nCảm ơn' }
    ]);
  });

  test('converts source international phone formats to local digits', () => {
    expect(normalizeTicketRow({
      center_name: 'TTBH Quận 10',
      address: 'TP. Hồ Chí Minh',
      ticket_code: 'BH-000001/2025',
      customer_name: 'Nguyễn An',
      customer_phone: '+84 903.123.456',
      device_model: 'Samsung Y2',
      status: 'DA_DONG',
      received_at: '2025-02-23 12:30'
    }, 2).customer_phone).toBe('0903123456');
  });

  test('maps source survey scores to CSAT without inventing NPS', () => {
    const { ticketRows, ticketsSkippedMissingPhone, surveyResponsesSkipped } = buildFullDatasetRows({
      centers: [{ center_id: '1', center_name: 'TTBH Quận 10', thanh_pho: 'TP. Hồ Chí Minh' }],
      customers: [
        { record_id: '11', ho_ten: 'Khách A', so_dien_thoai: '0901234567' },
        { record_id: '12', ho_ten: 'Khách B', so_dien_thoai: '' }
      ],
      products: [{ product_id: '21', product_name: 'Samsung Y2' }],
      tickets: [
        {
          ticket_id: '101',
          ticket_code: 'BH-000101/2025',
          customer_id: '11',
          product_id: '21',
          center_id: '1',
          status: 'DA_DONG',
          received_at: '2025-02-23 12:30'
        },
        {
          ticket_id: '102',
          ticket_code: 'BH-000102/2025',
          customer_id: '12',
          product_id: '21',
          center_id: '1',
          status: 'DA_DONG',
          received_at: '2025-02-23 12:30'
        }
      ],
      surveys: [
        { response_id: '1', ticket_id: '101', score: '4', comment: 'Tốt', responded_at: '2025-02-24 10:00' },
        { response_id: '2', ticket_id: '102', score: '5', comment: 'Rất tốt', responded_at: '2025-02-24 10:00' }
      ]
    });

    expect(ticketRows).toHaveLength(1);
    expect(ticketRows[0]).toMatchObject({
      ticket_code: 'BH-000101/2025',
      csat_score: 4,
      feedback_content: 'Tốt'
    });
    expect(ticketRows[0]).not.toHaveProperty('nps_score');
    expect(ticketsSkippedMissingPhone).toBe(1);
    expect(surveyResponsesSkipped).toBe(1);
  });

  test('includes a few hundred source-derived records in the reproducible seed', () => {
    const samplePath = path.join(__dirname, '../../../data/sample/tickets.csv');
    const rows = parseCsv(fs.readFileSync(samplePath, 'utf8'));

    expect(rows.length).toBe(300);
    expect(rows.some((row) => row.csat_score)).toBe(true);
    expect(rows.every((row) => !row.nps_score)).toBe(true);
  });
});
