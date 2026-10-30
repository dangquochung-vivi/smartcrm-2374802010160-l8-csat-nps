jest.mock('../repositories/surveyRepository', () => ({
  findAll: jest.fn(),
  getStats: jest.fn(),
  create: jest.fn()
}));

const repository = require('../repositories/surveyRepository');
const surveyService = require('../services/surveyService');

describe('surveyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      feedback_content: 'Dịch vụ tốt'
    }));
  });

  test('accepts the minimum and maximum score boundaries', async () => {
    await expect(surveyService.submitSurvey({
      ticket_code: 'DEMO-MIN-01',
      csat_score: 1,
      nps_score: 0
    })).resolves.toMatchObject({ csat_score: 1, nps_score: 0 });

    await expect(surveyService.submitSurvey({
      ticket_code: 'DEMO-MAX-01',
      csat_score: 5,
      nps_score: 10
    })).resolves.toMatchObject({ csat_score: 5, nps_score: 10 });
  });

  test.each([
    [null, 'Dữ liệu khảo sát không hợp lệ'],
    [{ ticket_code: '', csat_score: 5, nps_score: 10 }, 'Mã phiếu cần có từ 1 đến 20 ký tự'],
    [{ ticket_code: 'DEMO-BAD-01', csat_score: 0, nps_score: 10 }, 'Điểm CSAT phải là số nguyên từ 1 đến 5'],
    [{ ticket_code: 'DEMO-BAD-02', csat_score: 5, nps_score: 11 }, 'Điểm NPS phải là số nguyên từ 0 đến 10'],
    [{ ticket_code: 'DEMO-BAD-03', csat_score: '5', nps_score: 10 }, 'Điểm CSAT phải là số nguyên từ 1 đến 5'],
    [{ ticket_code: 'DEMO-BAD-04', csat_score: 5, nps_score: 10, feedback_content: 'x'.repeat(501) }, 'Nhận xét phải là văn bản không quá 500 ký tự']
  ])('rejects invalid input with a clear message', async (data, message) => {
    await expect(surveyService.submitSurvey(data))
      .rejects.toMatchObject({ code: 'INVALID_SURVEY', message });
    expect(repository.create).not.toHaveBeenCalled();
  });

  test('rejects a survey if its ticket is not eligible', async () => {
    repository.create.mockResolvedValue(null);
    await expect(surveyService.submitSurvey({
      ticket_code: 'NOT-CLOSED',
      csat_score: 5,
      nps_score: 10
    })).rejects.toMatchObject({ code: 'TICKET_NOT_ELIGIBLE', status: 404 });
  });
});
