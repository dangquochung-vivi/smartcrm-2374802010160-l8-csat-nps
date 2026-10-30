jest.mock('../repositories/ticketRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));
jest.mock('../repositories/serviceCenterRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

const ticketRepository = require('../repositories/ticketRepository');
const serviceCenterRepository = require('../repositories/serviceCenterRepository');
const ticketService = require('../services/ticketService');

describe('ticketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    serviceCenterRepository.findById.mockResolvedValue({ center_id: 1, center_name: 'Center A' });
    ticketRepository.create.mockImplementation(async (data) => ({ ticket_id: 10, ...data }));
    ticketRepository.update.mockImplementation(async (id, data) => ({ ticket_id: id, ...data }));
    ticketRepository.delete.mockResolvedValue(true);
  });

  const validTicket = {
    ticket_code: 'PB-TEST-01',
    center_id: 1,
    customer_name: 'Khách hàng',
    customer_phone: '0901234567',
    device_model: 'Demo device',
    status: 'MOI'
  };

  test('creates a normalized ticket linked to an existing center', async () => {
    await expect(ticketService.create({ ...validTicket, ticket_code: ' PB-TEST-01 ' }))
      .resolves.toMatchObject({ ticket_code: 'PB-TEST-01', center_id: 1 });
    expect(ticketRepository.create).toHaveBeenCalledWith(validTicket);
  });

  test('rejects invalid input and missing service centers', async () => {
    await expect(ticketService.create({ ...validTicket, ticket_code: '' }))
      .rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT' });

    serviceCenterRepository.findById.mockResolvedValue(null);
    await expect(ticketService.create(validTicket))
      .rejects.toMatchObject({ status: 400, code: 'INVALID_CENTER' });
    expect(ticketRepository.create).not.toHaveBeenCalled();
  });

  test('validates filters before querying ticket data', async () => {
    await expect(ticketService.findAll({ status: 'UNKNOWN' }))
      .rejects.toMatchObject({ status: 400 });
    expect(ticketRepository.findAll).not.toHaveBeenCalled();
  });

  test('updates and deletes a ticket', async () => {
    await expect(ticketService.update(10, validTicket)).resolves.toMatchObject({ ticket_id: 10 });
    await expect(ticketService.delete(10)).resolves.toBeUndefined();
    expect(ticketRepository.update).toHaveBeenCalledWith(10, validTicket);
    expect(ticketRepository.delete).toHaveBeenCalledWith(10);
  });
});
