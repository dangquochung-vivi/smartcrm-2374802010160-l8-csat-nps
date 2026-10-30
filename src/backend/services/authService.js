const crypto = require('crypto');
const customerAccountRepository = require('../repositories/customerAccountRepository');

const DEMO_PASSWORD = 'demo123';
const TOKEN_LIFETIME_SECONDS = 4 * 60 * 60;
const demoAccounts = [
  { username: 'marketing.demo', name: 'Bộ phận Marketing', role: 'marketing' },
  { username: 'cskh.demo', name: 'Nhân viên CSKH', role: 'support' },
  { username: 'quanly.demo', name: 'Quản lý trung tâm', role: 'manager' }
].map((account) => {
  const salt = crypto.randomBytes(16);
  return {
    ...account,
    salt,
    passwordHash: crypto.scryptSync(DEMO_PASSWORD, salt, 64)
  };
});
function toBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function publicAccount(account) {
  return {
    username: account.username,
    ...(account.email ? { email: account.email } : {}),
    name: account.name,
    role: account.role
  };
}

function getDemoAccounts() {
  return demoAccounts.map(publicAccount);
}

async function getAccount(username) {
  const normalizedUsername = String(username || '').trim().toLowerCase();
  const demoAccount = demoAccounts.find((account) => account.username === normalizedUsername);
  if (demoAccount) return demoAccount;
  return customerAccountRepository.findByEmail(normalizedUsername);
}

function verifyPassword(account, password) {
  if (!account || typeof password !== 'string'
    || !Buffer.isBuffer(account.salt) || !Buffer.isBuffer(account.passwordHash)
    || account.passwordHash.length !== 64) return false;
  const candidate = crypto.scryptSync(password, account.salt, 64);
  return crypto.timingSafeEqual(candidate, account.passwordHash);
}

async function registerCustomer({ name, email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedName = String(name || '').trim();
  const invalid = (message) => {
    const error = new Error(message);
    error.code = 'INVALID_REGISTRATION';
    throw error;
  };

  if (normalizedName.length < 2 || normalizedName.length > 80) {
    invalid('Họ tên cần có từ 2 đến 80 ký tự');
  }
  if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    invalid('Email không hợp lệ');
  }
  if (typeof password !== 'string' || password.length < 8) {
    invalid('Mật khẩu cần có ít nhất 8 ký tự');
  }
  const salt = crypto.randomBytes(16);
  const passwordHash = crypto.scryptSync(password, salt, 64);
  try {
    return await customerAccountRepository.create({
      email: normalizedEmail,
      name: normalizedName,
      salt,
      passwordHash
    });
  } catch (error) {
    if (error.code === '23505') {
      const duplicateError = new Error('Email này đã được đăng ký');
      duplicateError.code = 'EMAIL_EXISTS';
      throw duplicateError;
    }
    throw error;
  }
}

function signToken(account, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = toBase64Url(JSON.stringify({
    sub: account.username,
    name: account.name,
    role: account.role,
    iat: nowSeconds,
    exp: nowSeconds + TOKEN_LIFETIME_SECONDS
  }));
  const unsignedToken = `${header}.${payload}`;
  const signature = crypto.createHmac('sha256', secret).update(unsignedToken).digest('base64url');
  return `${unsignedToken}.${signature}`;
}

function verifyToken(token, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (typeof token !== 'string' || !secret) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto.createHmac('sha256', secret).update(unsignedToken).digest();
  let providedSignature;
  let header;
  let payload;

  try {
    providedSignature = Buffer.from(signature, 'base64url');
    header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8'));
    payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (header.alg !== 'HS256' || providedSignature.length !== expectedSignature.length) return null;
  if (!crypto.timingSafeEqual(providedSignature, expectedSignature)) return null;
  if (!Number.isInteger(payload.exp) || payload.exp <= nowSeconds) return null;

  if (typeof payload.sub !== 'string' || typeof payload.name !== 'string'
    || typeof payload.role !== 'string') return null;
  return {
    username: payload.sub,
    name: payload.name,
    role: payload.role,
    ...(payload.role === 'customer' ? { email: payload.sub } : {})
  };
}

module.exports = {
  DEMO_PASSWORD,
  getAccount,
  getDemoAccounts,
  registerCustomer,
  signToken,
  verifyPassword,
  verifyToken
};