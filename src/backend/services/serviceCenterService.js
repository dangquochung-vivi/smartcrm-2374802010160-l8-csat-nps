const repository = require('../repositories/serviceCenterRepository');
const ServiceError = require('./serviceError');

function validateId(id) {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ServiceError('Mã trung tâm không hợp lệ');
  }
  return parsed;
}

function validateData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new ServiceError('Dữ liệu trung tâm không hợp lệ');
  }
  const centerName = typeof data.center_name === 'string' ? data.center_name.trim() : '';
  const address = typeof data.address === 'string' ? data.address.trim() : '';
  if (centerName.length < 2 || centerName.length > 100) {
    throw new ServiceError('Tên trung tâm cần có từ 2 đến 100 ký tự');
  }
  if (!address || address.length > 255) {
    throw new ServiceError('Địa chỉ trung tâm cần có từ 1 đến 255 ký tự');
  }
  return { center_name: centerName, address };
}

class ServiceCenterService {
  findAll() {
    return repository.findAll();
  }

  async findById(id) {
    const center = await repository.findById(validateId(id));
    if (!center) throw new ServiceError('Không tìm thấy trung tâm', 404, 'NOT_FOUND');
    return center;
  }

  async create(data) {
    try {
      return await repository.create(validateData(data));
    } catch (error) {
      if (error.code === '23505') {
        throw new ServiceError('Tên trung tâm đã tồn tại', 409, 'DUPLICATE_CENTER');
      }
      throw error;
    }
  }

  async update(id, data) {
    try {
      const center = await repository.update(validateId(id), validateData(data));
      if (!center) throw new ServiceError('Không tìm thấy trung tâm', 404, 'NOT_FOUND');
      return center;
    } catch (error) {
      if (error.code === '23505') {
        throw new ServiceError('Tên trung tâm đã tồn tại', 409, 'DUPLICATE_CENTER');
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await repository.delete(validateId(id));
      if (!deleted) throw new ServiceError('Không tìm thấy trung tâm', 404, 'NOT_FOUND');
    } catch (error) {
      if (error.code === '23503') {
        throw new ServiceError('Không thể xóa trung tâm đang có phiếu bảo hành', 409, 'CENTER_IN_USE');
      }
      throw error;
    }
  }
}

module.exports = new ServiceCenterService();
