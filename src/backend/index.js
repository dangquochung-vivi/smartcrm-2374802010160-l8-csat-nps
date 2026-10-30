const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const authService = require('./services/authService');
const pool = require('./db');

const app = express();
const publicDirectory = path.join(__dirname, 'public');
const jwtSecret = process.env.SECRET_KEY || crypto.randomBytes(32).toString('hex');
const revokedTokens = new Map();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'SmartCRM CSAT/NPS' }));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'login.html'));
});

app.get('/customer/login', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'customer-login.html'));
});

app.get('/customer/register', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'register.html'));
});

app.get('/customer', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'customer.html'));
});

app.get('/operations', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'operations.html'));
});

app.get('/survey/list', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'survey-list.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'index.html'));
});

async function requireAuth(req, res, next) {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

    for (const [revokedToken, expiresAt] of revokedTokens) {
        if (expiresAt <= Date.now()) revokedTokens.delete(revokedToken);
    }

    const tokenUser = authService.verifyToken(token, jwtSecret);
    if (!tokenUser || revokedTokens.has(token)) {
        return res.status(401).json({ success: false, code: 'UNAUTHENTICATED', error: 'Vui lòng đăng nhập lại' });
    }

    try {
        const account = await authService.getAccount(tokenUser.username);
        if (!account || tokenUser.role !== account.role || tokenUser.name !== account.name) {
            return res.status(401).json({ success: false, code: 'UNAUTHENTICATED', error: 'Vui lòng đăng nhập lại' });
        }
        req.user = {
            username: account.username,
            ...(account.email ? { email: account.email } : {}),
            name: account.name,
            role: account.role
        };
        req.token = token;
        return next();
    } catch (error) {
        console.error('Authentication lookup failed:', error.message);
        return res.status(503).json({
            success: false,
            code: 'AUTH_UNAVAILABLE',
            error: 'Không thể xác thực tài khoản lúc này; vui lòng kiểm tra kết nối PostgreSQL'
        });
    }
}

function issueToken(res, account) {
    const token = authService.signToken(account, jwtSecret);
    res.json({ success: true, data: { token, user: account } });
}

app.get('/auth/demo-accounts', (req, res) => {
    res.json({ success: true, data: authService.getDemoAccounts() });
});

app.post('/auth/login', async (req, res) => {
    try {
        const account = await authService.getAccount(req.body?.username);
        if (!authService.verifyPassword(account, req.body?.password)) {
            return res.status(401).json({ success: false, code: 'INVALID_CREDENTIALS', error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
        return issueToken(res, { username: account.username, name: account.name, role: account.role, ...(account.email ? { email: account.email } : {}) });
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(503).json({ success: false, code: 'AUTH_UNAVAILABLE', error: 'Không thể đăng nhập lúc này; vui lòng kiểm tra kết nối PostgreSQL' });
    }
});

app.post('/auth/register', async (req, res) => {
    try {
        const account = await authService.registerCustomer(req.body || {});
        return issueToken(res, account);
    } catch (error) {
        if (error.code === 'EMAIL_EXISTS') {
            return res.status(409).json({ success: false, code: error.code, error: error.message });
        }
        if (error.code === 'INVALID_REGISTRATION') {
            return res.status(400).json({ success: false, code: error.code, error: error.message });
        }
        console.error('Customer registration failed:', error.message);
        return res.status(503).json({
            success: false,
            code: 'REGISTRATION_UNAVAILABLE',
            error: 'Không thể lưu tài khoản lúc này; vui lòng kiểm tra kết nối PostgreSQL'
        });
    }
});

app.post('/auth/demo-login', (req, res) => {
    const username = String(req.body?.username || '').trim().toLowerCase();
    const account = authService.getDemoAccounts().find((item) => item.username === username);
    if (!account) {
        return res.status(400).json({ success: false, error: 'Tài khoản demo không hợp lệ' });
    }
    issueToken(res, { username: account.username, name: account.name, role: account.role });
});

app.get('/auth/me', requireAuth, (req, res) => {
    res.json({ success: true, data: req.user });
});

app.post('/auth/logout', requireAuth, (req, res) => {
    revokedTokens.set(req.token, Date.now() + 4 * 60 * 60 * 1000);
    res.json({ success: true });
});

// Kiểm tra kết nối CSDL
app.get('/db-check', requireAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS server_time');
        res.json({ status: 'OK', ...result.rows[0] });
    } catch (err) {
        console.error('db-check failed:', err.message);
        res.status(503).json({
            status: 'ERROR',
            message: 'Không thể kết nối PostgreSQL; chức năng kiểm tra database tạm thời không khả dụng'
        });
    }
});

// Khai báo Routes cho module khảo sát CSAT & NPS (Luồng L8)
const surveyRoutes = require('./routes/surveyRoutes');
app.use('/surveys', requireAuth, (req, res, next) => {
    if (req.path === '/ticket-check' && req.user.role !== 'customer') {
        return res.status(403).json({ success: false, code: 'FORBIDDEN', error: 'Chỉ khách hàng mới có thể tìm phiếu để gửi khảo sát' });
    }
    if (req.user.role === 'customer' && req.method === 'GET' && req.path !== '/ticket-check') {
        return res.status(403).json({ success: false, code: 'FORBIDDEN', error: 'Khách hàng không có quyền xem danh sách nội bộ' });
    }
    if (req.method === 'POST' && req.user.role !== 'customer') {
        return res.status(403).json({ success: false, code: 'FORBIDDEN', error: 'Chỉ khách hàng mới có thể gửi khảo sát' });
    }
    if (req.user.role === 'customer' && req.method !== 'GET' && req.method !== 'POST') {
        return res.status(403).json({ success: false, code: 'FORBIDDEN', error: 'Không có quyền thực hiện thao tác này' });
    }
    next();
}, surveyRoutes);

function requireInternalUser(req, res, next) {
    if (req.user.role === 'customer') {
        return res.status(403).json({ success: false, code: 'FORBIDDEN', error: 'Chỉ nhân viên nội bộ được quản lý dữ liệu' });
    }
    next();
}

app.use('/api/service-centers', requireAuth, requireInternalUser, require('./routes/serviceCenterRoutes'));
app.use('/api/tickets', requireAuth, requireInternalUser, require('./routes/ticketRoutes'));

app.use(express.static(publicDirectory, { index: false }));

const port = process.env.APP_PORT || 3000;
app.listen(port, () => console.log('Server chay tai http://localhost:' + port));