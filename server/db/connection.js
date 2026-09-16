import mysql  from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'admin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME     || 'ops',
    port:     process.env.DB_PORT     || 3306,
});

// DB 연결 테스트
pool.getConnection()
    .then(() => console.log('✅ MySQL 연결 성공!!'))
    .catch((err) => console.log('❌ MySQL 연결 실패:', err.message));

export default pool;
