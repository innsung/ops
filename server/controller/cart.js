import * as repository from '../repository/cart.js';

/** 장바구니 조회 */
export const getCart = async (req, res, next) => {
    try {
        const items = await repository.getCart(req.params.uid);
        res.json(items);
    } catch (err) {
        next(err);
    }
};

/** 장바구니 추가 */
export const addCart = async (req, res, next) => {
    try {
        const { uid, pid, count } = req.body;
        if (!uid || !pid) {
            return res.status(400).json({ message: '필수 항목이 누락되었습니다.' });
        }

        // 이미 담긴 상품이면 수량 증가
        const existing = await repository.findCartItem(uid, pid);
        if (existing) {
            await repository.updateCount(existing.cid, existing.count + (count || 1));
            return res.json({ message: '수량이 업데이트 되었습니다.' });
        }

        await repository.addCart({ uid, pid, count: count || 1 });
        res.status(201).json({ message: '장바구니에 담겼습니다.' });
    } catch (err) {
        next(err);
    }
};

/** 수량 변경 */
export const updateCount = async (req, res, next) => {
    try {
        const { count } = req.body;
        if (count < 1) {
            return res.status(400).json({ message: '최소 수량은 1개입니다.' });
        }
        await repository.updateCount(req.params.cid, count);
        res.json({ message: '수량이 변경되었습니다.' });
    } catch (err) {
        next(err);
    }
};

/** 장바구니 삭제 */
export const deleteCart = async (req, res, next) => {
    try {
        await repository.deleteCart(req.params.cid);
        res.json({ message: '삭제되었습니다.' });
    } catch (err) {
        next(err);
    }
};
