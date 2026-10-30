jest.mock('../repositories/customerAccountRepository', () => ({
  findByEmail: jest.fn(),
  create: jest.fn()
}));

const customerAccountRepository = require('../repositories/customerAccountRepository');
const authService = require('../services/authService');

describe('authService', () => {
  let storedCustomer;

  beforeEach(() => {
    jest.clearAllMocks();
    storedCustomer = null;
    customerAccountRepository.findByEmail.mockImplementation(async (email) =>
      storedCustomer?.email === email ? storedCustomer : null);
    customerAccountRepository.create.mockImplementation(async (account) => {
      storedCustomer = {
        username: account.email,
        email: account.email,
        name: account.name,
        role: 'customer',
        salt: account.salt,
        passwordHash: account.passwordHash
      };
      return {
        username: account.email,
        email: account.email,
        name: account.name,
        role: 'customer'
      };
    });
  });

  test('provides demo identities for the L8 actors', () => {
    expect(authService.getDemoAccounts().map((account) => account.role)).toEqual([
      'marketing',
      'support',
      'manager'
    ]);
  });

  test('verifies the demo password without exposing password hashes', async () => {
    const account = await authService.getAccount('cskh.demo');
    expect(authService.verifyPassword(account, authService.DEMO_PASSWORD)).toBe(true);
    expect(authService.verifyPassword(account, 'incorrect')).toBe(false);
    expect(authService.getDemoAccounts()[1]).not.toHaveProperty('passwordHash');
  });

  test('accepts a valid token and rejects a modified signature', async () => {
    const account = await authService.getAccount('quanly.demo');
    const token = authService.signToken(account, 'test-secret', 1000);

    expect(authService.verifyToken(token, 'test-secret', 1001)).toMatchObject({
      username: 'quanly.demo',
      role: 'manager'
    });
    expect(authService.verifyToken(`${token}x`, 'test-secret', 1001)).toBeNull();
  });

  test('rejects an expired token', async () => {
    const account = await authService.getAccount('marketing.demo');
    const token = authService.signToken(account, 'test-secret', 1000);
    expect(authService.verifyToken(token, 'test-secret', 1000 + 4 * 60 * 60)).toBeNull();
  });

  test('stores registered customers through the repository with a verifiable password hash', async () => {
    const email = `customer-${Date.now()}@example.test`;
    const customer = await authService.registerCustomer({
      name: 'Khách hàng thử nghiệm',
      email: ` ${email.toUpperCase()} `,
      password: 'customer-pass-8'
    });
    const storedAccount = await authService.getAccount(email);
    const token = authService.signToken(storedAccount, 'test-secret', 1000);

    expect(customer).toMatchObject({ email, role: 'customer' });
    expect(customerAccountRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      email,
      name: 'Khách hàng thử nghiệm',
      salt: expect.any(Buffer),
      passwordHash: expect.any(Buffer)
    }));
    expect(authService.verifyPassword(storedAccount, 'customer-pass-8')).toBe(true);
    expect(authService.verifyToken(token, 'test-secret', 1001)?.role).toBe('customer');
  });

  test('reports duplicate email from the unique database constraint', async () => {
    const duplicateError = new Error('duplicate key');
    duplicateError.code = '23505';
    customerAccountRepository.create.mockRejectedValueOnce(duplicateError);

    await expect(authService.registerCustomer({
      name: 'Another User',
      email: 'duplicate@example.test',
      password: 'password-123'
    })).rejects.toMatchObject({ code: 'EMAIL_EXISTS', message: 'Email này đã được đăng ký' });
  });

  test('rejects invalid registration data before writing to the database', async () => {
    await expect(authService.registerCustomer({
      name: 'A',
      email: 'not-an-email',
      password: 'short'
    })).rejects.toMatchObject({ code: 'INVALID_REGISTRATION' });
    expect(customerAccountRepository.create).not.toHaveBeenCalled();
  });
});
