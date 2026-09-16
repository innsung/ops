import pool from '../db/connection.js';

/** 관심상품 목록 조회 (상품 정보 JOIN) */
export const getWishlist = async (uid) => {
    const sql = `
        SELECT  w.wid,
                w.pid,
                w.cdate,
                p.name    AS title,
                p.price,
                p.category,
                CONCAT('/img/', p.imgurl) AS imgurl
        FROM wishlist w
        JOIN product p ON w.pid = p.pid
        WHERE w.uid = ?
        ORDER BY w.cdate DESC
    `;
    const [results] = await pool.execute(sql, [uid]);
    return results;
};

/** 찜 여부 확인 */
export const checkWish = async (uid, pid) => {
    const sql = `SELECT wid FROM wishlist WHERE uid = ? AND pid = ?`;
    const [result] = await pool.execute(sql, [uid, pid]);
    return result[0] || null;
};

/** 찜 추가 */
export const addWish = async (uid, pid) => {
    const sql = `INSERT INTO wishlist (uid, pid) VALUES (?, ?)`;
    const [result] = await pool.execute(sql, [uid, pid]);
    return result;
};

/** 찜 취소 */
export const removeWish = async (uid, pid) => {
    const sql = `DELETE FROM wishlist WHERE uid = ? AND pid = ?`;
    const [result] = await pool.execute(sql, [uid, pid]);
    return result;
};

/** 관심상품 수 */
export const getWishCount = async (uid) => {
    const sql = `SELECT COUNT(*) AS count FROM wishlist WHERE uid = ?`;
    const [result] = await pool.execute(sql, [uid]);
    return result[0].count;
};
