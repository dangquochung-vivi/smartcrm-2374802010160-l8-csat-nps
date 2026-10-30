jest.mock('../repositories/serviceCenterRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

const repository = require('../repositories/serviceCenterRepository');
const service = require('../services/serviceCenterService');

describe('serviceCenterService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    repository.create.mockImplementation(async (data) => ({ center_id: 1, ...data }));
    repository.update.mockImplementation(async (id, data) => ({ center_id: id, ...data }));
    repository.delete.mockResolvedValue(true);
  });

  test('creates and updates a validated service center', async () => {
    const data = { center_name: ' Trung tâm Quận 1 ', address: ' 123 Nguyễn Huệ ' };
    await expect(service.create(data)).resolves.toMatchObject({
      center_name: 'Trung tâm Quận 1',
      address: '123 Nguyễn Huệ'
    });
    await expect(service.update(1, data)).resolves.toMatchObject({ center_id: 1 });
  });

  test('rejects invalid service center data', async () => {
    await expect(service.create({ center_name: '', address: '' }))
      .rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT' });
    expect(repository.create).not.toHaveBeenCalled();
  });

  test('does not silently ignore missing centers', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findById(404)).rejects.toMatchObject({
      status: 404,
      code: 'NOT_FOUND'
    });
  });
});
