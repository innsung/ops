import pool from '../db/connection.js';

/** 아이디로 사용자 조회 */
export const findById = async (id) => {
    const sql = `SELECT * FROM user WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result[0];
};

/** 회원가입 */
export const createUser = async ({ id, pwd, name, phone, email }) => {
    const sql = `
        INSERT INTO user (id, pwd, name, phone, email)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [id, pwd, name, phone || null, email || null]);
    return result;
};
