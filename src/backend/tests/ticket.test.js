jest.mock('../repositories/surveyRepository', () => ({
  findAll: jest.fn(),
  getStats: jest.fn(),
  create: jest.fn()
}));

const repository = require('../repositories/surveyRepository');
const surveyService = require('../services/surveyService');

describe('survey reporting', () => {
  test('returns aggregate report values from the repository', async () => {
    repository.getStats.mockResolvedValue({
      total: 4,
      avgCsat: 4.5,
      avgNps: 8.5,
      happyRate: 75,
      promoterRate: 50
    });

    await expect(surveyService.getStats()).resolves.toEqual({
      total: 4,
      avgCsat: 4.5,
      avgNps: 8.5,
      happyRate: 75,
      promoterRate: 50
    });
    expect(repository.getStats).toHaveBeenCalledTimes(1);
  });

  test('returns the repository survey list', async () => {
    const surveys = [{ id: 1, ticket_code: 'PB-2-00001', csat_score: 5, nps_score: 9 }];
    repository.findAll.mockResolvedValue(surveys);

    await expect(surveyService.getAllSurveys()).resolves.toBe(surveys);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});
