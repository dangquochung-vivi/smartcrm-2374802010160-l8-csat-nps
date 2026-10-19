require('dotenv').config({ path: '../../.env' });
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Cấu hình kết nối PostgreSQL từ biến môi trường
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

app.get('/', (req, res) => res.send('Mekong Mobile Smart CRM - L8 CSAT & NPS Module'));

// Kiểm tra kết nối CSDL
app.get('/db-check', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS server_time');
        res.json({ status: 'OK', ...result.rows[0] });
    } catch (err) {
        res.status(500).json({ status: 'ERROR', message: err.message });
    }
});

// Khai báo Routes cho module khảo sát CSAT & NPS (Luồng L8)
const surveyRoutes = require('./routes/surveyRoutes');
app.use('/surveys', surveyRoutes);

const port = process.env.APP_PORT || 3000;
app.listen(port, () => console.log('Server chay tai http://localhost:' + port));