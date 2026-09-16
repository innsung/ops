import pool from '../db/connection.js';

export const eventAll = async () => {
    const sql = `select * from community_event order by id;`
    const [result] = await pool.execute(sql, [])
    return result;
}

export const noticeAll = async (tabType) => {
    let sql = `select * from community_notice`
    const params = []

    if (tabType && tabType !== "전체") {
        sql += ` where type = ?`
        params.push(tabType)
    }

    sql += ` order by id desc`

    const [result] = await pool.execute(sql, params)
    return result
}

export const qnaAll = async () => {
    const sql = `select * from community_qna order by id desc`
    const [result] = await pool.execute(sql, [])
    return result
}

export const qnaCreate = async (userId, title, content) => {
    const sql = `insert into community_qna (user_id, title, content) values (?, ?, ?)`
    const [result] = await pool.execute(sql, [userId, title, content])
    return result
}

export const qnaAnswer = async (id, answer) => {
    const sql = `update community_qna set answer = ?, answered_at = now() where id = ?`
    const [result] = await pool.execute(sql, [answer, id])
    return result
}
