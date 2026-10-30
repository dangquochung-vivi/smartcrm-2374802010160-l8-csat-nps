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

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'index.html'));
});

function requireAuth(req, res, next) {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const user = authService.verifyToken(token, jwtSecret);

    for (const [revokedToken, expiresAt] of revokedTokens) {
        if (expiresAt <= Date.now()) revokedTokens.delete(revokedToken);
    }

    if (!user || revokedTokens.has(token)) {
        return res.status(401).json({ success: false, code: 'UNAUTHENTICATED', error: 'Vui lòng đăng nhập lại' });
    }

    req.user = user;
    req.token = token;
    next();
}

function issueToken(res, account) {
    const token = authService.signToken(account, jwtSecret);
    res.json({ success: true, data: { token, user: account } });
}

app.get('/auth/demo-accounts', (req, res) => {
    res.json({ success: true, data: authService.getDemoAccounts() });
});

app.post('/auth/login', (req, res) => {
    const account = authService.getAccount(req.body?.username);
    if (!authService.verifyPassword(account, req.body?.password)) {
        return res.status(401).json({ success: false, code: 'INVALID_CREDENTIALS', error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    issueToken(res, { username: account.username, name: account.name, role: account.role });
});

app.post('/auth/register', (req, res) => {
    try {
        const account = authService.registerCustomer(req.body || {});
        issueToken(res, account);
    } catch (error) {
        const status = error.code === 'EMAIL_EXISTS' ? 409 : 400;
        res.status(status).json({ success: false, code: error.code || 'INVALID_REGISTRATION', error: error.message });
    }
});

app.post('/auth/demo-login', (req, res) => {
    const account = authService.getAccount(req.body?.username);
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
    if (req.method === 'GET' && req.user.role === 'customer') {
        return res.status(403).json({ success: false, code: 'FORBIDDEN', error: 'Khách hàng không có quyền xem danh sách nội bộ' });
    }
    if (req.method === 'POST' && req.user.role === 'customer') {
        req.body = {
            ...req.body,
            customer_email: req.user.email,
            customer_name: req.user.name
        };
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