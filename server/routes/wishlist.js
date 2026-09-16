import express    from 'express';
import * as controller from '../controller/wishlist.js';

const router = express.Router();

router.get('/:uid',       controller.getWishlist);   // 내 관심상품 목록
router.post('/',          controller.toggleWish);    // 추가/취소 토글
router.get('/check/:uid/:pid', controller.checkWish); // 찜 여부 확인

export default router;
