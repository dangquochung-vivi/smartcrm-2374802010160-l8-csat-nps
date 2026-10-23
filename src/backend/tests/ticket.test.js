const surveyService = require('../services/surveyService');

describe('Kiem tra nghiep vu Smart CRM (Buoi 10)', () => {
  test('1. Tinh tong so phieu khach hang phai co du lieu', async () => {
    const stats = await surveyService.getStats();
    expect(stats.total).toBeGreaterThanOrEqual(2);
  });

  test('2. CSAT trung binh phai dung dinh dang so', async () => {
    const stats = await surveyService.getStats();
    expect(typeof stats.avgCsat).toBe('number');
    expect(stats.avgCsat).toBeGreaterThan(0);
  });

  test('3. NPS trung binh phai duoc tinh theo cong thuc', async () => {
    const stats = await surveyService.getStats();
    expect(typeof stats.avgNps).toBe('number');
    expect(stats.avgNps).toBeGreaterThan(0);
  });

  test('4. Ty le hai long phai o khoang 0-100', async () => {
    const stats = await surveyService.getStats();
    expect(stats.happyRate).toBeGreaterThanOrEqual(0);
    expect(stats.happyRate).toBeLessThanOrEqual(100);
  });

  test('5. Du lieu luu phieu khach hang phai co ticket_code', async () => {
    const result = await surveyService.submitSurvey({
      ticket_code: 'PB-2-00015',
      csat_score: 5,
      nps_score: 9,
      feedback_content: 'Rất hài lòng'
    });

    expect(result).toHaveProperty('ticket_code', 'PB-2-00015');
  });
});