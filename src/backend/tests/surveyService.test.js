jest.mock('../repositories/surveyRepository', () => ({
  findCustomerTicket: jest.fn(),
  findAll: jest.fn(),
  getStats: jest.fn(),
  create: jest.fn()
}));

const repository = require('../repositories/surveyRepository');
const surveyService = require('../services/surveyService');

describe('surveyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    repository.findCustomerTicket.mockResolvedValue({
      ticket_code: 'DEMO-VALID-01',
      customer_name: 'Nguyễn Văn A',
      device_model: 'Phone',
      already_surveyed: false
    });
    repository.create.mockImplementation(async (data) => ({
      id: 8,
      ticket_code: data.ticket_code,
      csat_score: data.csat_score,
      nps_score: data.nps_score,
      feedback_content: data.feedback_content
    }));
  });

  test('accepts valid survey data and normalizes text fields', async () => {
    const result = await surveyService.submitSurvey({
      ticket_code: '  DEMO-VALID-01  ',
      customer_phone: '0901234567',
      csat_score: 4,
      nps_score: 8,
      feedback_content: '  Dịch vụ tốt  '
    });

    expect(result).toMatchObject({
      ticket_code: 'DEMO-VALID-01',
      csat_score: 4,
      nps_score: 8,
      feedback_content: 'Dịch vụ tốt'
    });
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
      ticket_code: 'DEMO-VALID-01',
      customer_phone: '0901234567',
      feedback_content: 'Dịch vụ tốt'
    }));
  });

  test('finds a completed customer ticket using its code and phone', async () => {
    await expect(surveyService.findCustomerTicket(' DEMO-VALID-01 ', '0901234567'))
      .resolves.toMatchObject({ ticket_code: 'DEMO-VALID-01', already_surveyed: false });
    expect(repository.findCustomerTicket).toHaveBeenCalledWith('DEMO-VALID-01', '0901234567');
  });

  test('normalizes admin search text before listing matching surveys', async () => {
    repository.findAll.mockResolvedValue([]);

    await expect(surveyService.getAllSurveys('  0901234567  ')).resolves.toEqual([]);

    expect(repository.findAll).toHaveBeenCalledWith('0901234567');
  });

  test('rejects invalid admin search input', async () => {
    await expect(surveyService.getAllSurveys(['customer']))
      .rejects.toMatchObject({ code: 'INVALID_SEARCH', status: 400 });
    expect(repository.findAll).not.toHaveBeenCalled();
  });

  test.each([
    ['', '0901234567', 'Vui lòng nhập mã phiếu từ 1 đến 20 ký tự'],
    ['DEMO-VALID-01', '123', 'Số điện thoại cần có từ 7 đến 20 ký tự hợp lệ'],
    ['DEMO-VALID-01', '+++++++', 'Số điện thoại cần có từ 7 đến 20 ký tự hợp lệ']
  ])('rejects invalid ticket search input', async (code, phone, message) => {
    await expect(surveyService.findCustomerTicket(code, phone))
      .rejects.toMatchObject({ code: 'INVALID_TICKET_LOOKUP', message });
    expect(repository.findCustomerTicket).not.toHaveBeenCalled();
  });

  test('does not find a ticket when the code and phone do not match', async () => {
    repository.findCustomerTicket.mockResolvedValue(null);
    await expect(surveyService.findCustomerTicket('DEMO-VALID-01', '0901234567'))
      .rejects.toMatchObject({ code: 'TICKET_NOT_FOUND', status: 404 });
  });

  test('accepts the minimum and maximum score boundaries', async () => {
    await expect(surveyService.submitSurvey({
      ticket_code: 'DEMO-MIN-01',
      customer_phone: '0901234567',
      csat_score: 1,
      nps_score: 0
    })).resolves.toMatchObject({ csat_score: 1, nps_score: 0 });

    await expect(surveyService.submitSurvey({
      ticket_code: 'DEMO-MAX-01',
      customer_phone: '0901234567',
      csat_score: 5,
      nps_score: 10
    })).resolves.toMatchObject({ csat_score: 5, nps_score: 10 });
  });

  test.each([
    [null, 'Dữ liệu khảo sát không hợp lệ'],
    [{ ticket_code: '', csat_score: 5, nps_score: 10 }, 'Mã phiếu cần có từ 1 đến 20 ký tự'],
    [{ ticket_code: 'DEMO-BAD-05', customer_phone: '123', csat_score: 5, nps_score: 10 }, 'Số điện thoại cần có từ 7 đến 20 ký tự hợp lệ'],
    [{ ticket_code: 'DEMO-BAD-01', customer_phone: '0901234567', csat_score: 0, nps_score: 10 }, 'Điểm CSAT phải là số nguyên từ 1 đến 5'],
    [{ ticket_code: 'DEMO-BAD-02', customer_phone: '0901234567', csat_score: 5, nps_score: 11 }, 'Điểm NPS phải là số nguyên từ 0 đến 10'],
    [{ ticket_code: 'DEMO-BAD-03', customer_phone: '0901234567', csat_score: '5', nps_score: 10 }, 'Điểm CSAT phải là số nguyên từ 1 đến 5'],
    [{ ticket_code: 'DEMO-BAD-04', customer_phone: '0901234567', csat_score: 5, nps_score: 10, feedback_content: 'x'.repeat(501) }, 'Nhận xét phải là văn bản không quá 500 ký tự']
  ])('rejects invalid input with a clear message', async (data, message) => {
    await expect(surveyService.submitSurvey(data))
      .rejects.toMatchObject({ code: 'INVALID_SURVEY', message });
    expect(repository.create).not.toHaveBeenCalled();
  });

  test('rejects a survey if its ticket is not eligible', async () => {
    repository.create.mockResolvedValue(null);
    await expect(surveyService.submitSurvey({
      ticket_code: 'NOT-CLOSED',
      customer_phone: '0901234567',
      csat_score: 5,
      nps_score: 10
    })).rejects.toMatchObject({ code: 'TICKET_NOT_ELIGIBLE', status: 404 });
  });
});
