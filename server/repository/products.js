import pool from '../db/connection.js';

/** 전체 상품 조회 - pid를 id로 alias + 리뷰 수 포함 */
export const getAll = async () => {
    const sql = `
        SELECT  p.pid        AS id,
                p.name       AS title,
                p.price,
                p.category,
                CONCAT('/img/', p.imgurl) AS imgurl,
                IF(p.icon = '', '', CONCAT('/img/', p.icon)) AS icon,
                COUNT(r.rid) AS reviewCount
        FROM product p
        LEFT JOIN review r ON p.pid = r.pid
        GROUP BY p.pid
        ORDER BY p.pid
    `;
    const [results] = await pool.execute(sql);
    return results;
};

/** 상품 상세 조회 */
export const getProduct = async (pid) => {
    const sql = `
        SELECT  pid      AS id,
                name     AS title,
                price,
                category,
                edate,
                smethod,
                imgurl,
                IF(icon = '', '', CONCAT('/img/', icon)) AS icon
        FROM product
        WHERE pid = ?
    `;
    const [result] = await pool.execute(sql, [pid]);
    return result[0];
};

/** 상품 QnA 조회 */
export const getQna = async (pid) => {
    const sql = `
        SELECT  qid,
                title,
                content,
                is_complete AS isComplete,
                is_lock     AS isLock,
                uid,
                pid,
                cdate
        FROM product_qna
        WHERE pid = ?
        ORDER BY cdate DESC
    `;
    const [results] = await pool.execute(sql, [pid]);
    return results;
};
