import pool from '../db/connection.js';

/** 장바구니 조회 (상품 정보 JOIN) */
export const getCart = async (uid) => {
    const sql = `
        SELECT  c.cid,
                c.uid,
                c.pid,
                c.count,
                p.name    AS name,
                p.price   AS ogprice,
                CONCAT('/img/', p.imgurl) AS imgurl
        FROM cart c
        JOIN product p ON c.pid = p.pid
        WHERE c.uid = ?
        ORDER BY c.cid
    `;
    const [results] = await pool.execute(sql, [uid]);
    return results;
};

/** 장바구니 중복 체크 */
export const findCartItem = async (uid, pid) => {
    const sql = `SELECT * FROM cart WHERE uid = ? AND pid = ?`;
    const [result] = await pool.execute(sql, [uid, pid]);
    return result[0];
};

/** 장바구니 추가 */
export const addCart = async ({ uid, pid, count }) => {
    const sql = `INSERT INTO cart (uid, pid, count) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(sql, [uid, pid, count]);
    return result;
};

/** 수량 변경 */
export const updateCount = async (cid, count) => {
    const sql = `UPDATE cart SET count = ? WHERE cid = ?`;
    const [result] = await pool.execute(sql, [count, cid]);
    return result;
};

/** 장바구니 삭제 */
export const deleteCart = async (cid) => {
    const sql = `DELETE FROM cart WHERE cid = ?`;
    const [result] = await pool.execute(sql, [cid]);
    return result;
};
