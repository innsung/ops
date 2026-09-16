import pool from '../db/connection.js';

/** 상품 리뷰 목록 조회 (작성자 이름 JOIN) */
export const getReviews = async (pid) => {
    const sql = `
        SELECT  r.rid,
                r.pid,
                r.content,
                r.rating,
                r.cdate,
                u.id   AS userId
        FROM review r
        JOIN user u ON r.uid = u.uid
        WHERE r.pid = ?
        ORDER BY r.cdate DESC
    `;
    const [results] = await pool.execute(sql, [pid]);
    return results;
};

/** 평균 별점 + 리뷰 수 */
export const getReviewSummary = async (pid) => {
    const sql = `
        SELECT  COUNT(*)          AS reviewCount,
                ROUND(AVG(rating), 1) AS avgRating
        FROM review
        WHERE pid = ?
    `;
    const [result] = await pool.execute(sql, [pid]);
    return result[0];
};

/** 리뷰 작성 */
export const createReview = async ({ pid, uid, content, rating }) => {
    const sql = `
        INSERT INTO review (pid, uid, content, rating)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [pid, uid, content, rating]);
    return result;
};
