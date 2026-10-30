class ServiceError extends Error {
  constructor(message, status = 400, code = 'INVALID_INPUT') {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
    this.code = code;
  }
}

module.exports = ServiceError;
