const authService = require('../services/authService');

describe('authService', () => {
  test('provides demo identities for the L8 actors', () => {
    expect(authService.getDemoAccounts().map((account) => account.role)).toEqual([
      'marketing',
      'support',
      'manager'
    ]);
  });

  test('verifies the demo password without exposing password hashes', () => {
    const account = authService.getAccount('cskh.demo');
    expect(authService.verifyPassword(account, authService.DEMO_PASSWORD)).toBe(true);
    expect(authService.verifyPassword(account, 'incorrect')).toBe(false);
    expect(authService.getDemoAccounts()[1]).not.toHaveProperty('passwordHash');
  });

  test('accepts a valid token and rejects a modified signature', () => {
    const account = authService.getAccount('quanly.demo');
    const token = authService.signToken(account, 'test-secret', 1000);

    expect(authService.verifyToken(token, 'test-secret', 1001)).toMatchObject({
      username: 'quanly.demo',
      role: 'manager'
    });
    expect(authService.verifyToken(`${token}x`, 'test-secret', 1001)).toBeNull();
  });

  test('rejects an expired token', () => {
    const token = authService.signToken(authService.getAccount('marketing.demo'), 'test-secret', 1000);
    expect(authService.verifyToken(token, 'test-secret', 1000 + 4 * 60 * 60)).toBeNull();
  });

  test('registers customers with normalized email and a verifiable password', () => {
    const email = `customer-${Date.now()}@example.test`;
    const customer = authService.registerCustomer({
      name: 'Khách hàng thử nghiệm',
      email: ` ${email.toUpperCase()} `,
      password: 'customer-pass-8'
    });
    const token = authService.signToken(authService.getAccount(email), 'test-secret', 1000);

    expect(customer).toMatchObject({ email, role: 'customer' });
    expect(authService.verifyPassword(authService.getAccount(email), 'customer-pass-8')).toBe(true);
    expect(authService.verifyToken(token, 'test-secret', 1001)?.role).toBe('customer');
    expect(() => authService.registerCustomer({ name: 'Another User', email, password: 'password-123' }))
      .toThrow('Email này đã được đăng ký');
  });
});