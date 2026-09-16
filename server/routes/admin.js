import express from 'express';
import pool from '../db/connection.js';
import { verifyAdmin } from '../controller/auth.js';

const router = express.Router();

// ✅ 모든 admin 라우트에 verifyAdmin 미들웨어 적용
router.use(verifyAdmin);

/* ────────────────────────────────────────
   회원 목록 조회
──────────────────────────────────────── */
router.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT uid, id, name, phone, email, role, created_at FROM user ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('❌ [admin/users]', err);
        res.status(500).json({ message: '회원 목록 조회 실패' });
    }
});

/* ── 회원 삭제 */
router.delete('/users/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        await pool.execute('DELETE FROM user WHERE uid = ?', [uid]);
        res.json({ message: '회원 삭제 완료' });
    } catch (err) {
        console.error('❌ [admin/users/delete]', err);
        res.status(500).json({ message: '회원 삭제 실패' });
    }
});

/* ────────────────────────────────────────
   상품 목록 조회
──────────────────────────────────────── */
router.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM product ORDER BY pid DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('❌ [admin/products]', err);
        res.status(500).json({ message: '상품 목록 조회 실패' });
    }
});

/* ── 상품 등록 */
router.post('/products', async (req, res) => {
    try {
        const { name, price, category, edate, smethod, imgurl, icon } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO product (name, price, category, edate, smethod, imgurl, icon) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, price, category, edate, smethod, imgurl, icon]
        );
        res.json({ message: '상품 등록 완료', pid: result.insertId });
    } catch (err) {
        console.error('❌ [admin/products/post]', err);
        res.status(500).json({ message: '상품 등록 실패' });
    }
});

/* ── 상품 수정 */
router.put('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { name, price, category, edate, smethod, imgurl, icon } = req.body;
        await pool.execute(
            'UPDATE product SET name=?, price=?, category=?, edate=?, smethod=?, imgurl=?, icon=? WHERE pid=?',
            [name, price, category, edate, smethod, imgurl, icon, pid]
        );
        res.json({ message: '상품 수정 완료' });
    } catch (err) {
        console.error('❌ [admin/products/put]', err);
        res.status(500).json({ message: '상품 수정 실패' });
    }
});

/* ── 상품 삭제 */
router.delete('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await pool.execute('DELETE FROM product WHERE pid = ?', [pid]);
        res.json({ message: '상품 삭제 완료' });
    } catch (err) {
        console.error('❌ [admin/products/delete]', err);
        res.status(500).json({ message: '상품 삭제 실패' });
    }
});

/* ────────────────────────────────────────
   주문 내역 조회 (cart 기반)
──────────────────────────────────────── */
router.get('/orders', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT
                c.cid,
                u.id   AS userId,
                u.name AS userName,
                u.phone,
                p.name AS productName,
                p.price,
                c.count,
                (p.price * c.count) AS totalAmount
            FROM cart c
            JOIN user    u ON c.uid = u.uid
            JOIN product p ON c.pid = p.pid
            ORDER BY c.cid DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('❌ [admin/orders]', err);
        res.status(500).json({ message: '주문 내역 조회 실패' });
    }
});

export default router;
