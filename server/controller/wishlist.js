import * as repository from '../repository/wishlist.js';

/** 관심상품 목록 */
export const getWishlist = async (req, res, next) => {
    try {
        const items = await repository.getWishlist(req.params.uid);
        res.json(items);
    } catch (err) { next(err); }
};

/** 찜 여부 확인 */
export const checkWish = async (req, res, next) => {
    try {
        const { uid, pid } = req.params;
        const wish = await repository.checkWish(uid, pid);
        res.json({ isWished: !!wish });
    } catch (err) { next(err); }
};

/** 찜 토글 (추가 ↔ 취소) */
export const toggleWish = async (req, res, next) => {
    try {
        const { uid, pid } = req.body;
        if (!uid || !pid) return res.status(400).json({ message: '필수 항목 누락' });

        const existing = await repository.checkWish(uid, pid);
        if (existing) {
            await repository.removeWish(uid, pid);
            const count = await repository.getWishCount(uid);
            return res.json({ isWished: false, wishCount: count, message: '관심상품에서 제거되었습니다.' });
        } else {
            await repository.addWish(uid, pid);
            const count = await repository.getWishCount(uid);
            return res.json({ isWished: true, wishCount: count, message: '관심상품에 추가되었습니다.' });
        }
    } catch (err) { next(err); }
};
