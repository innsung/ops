import express    from 'express';
import * as controller from '../controller/cart.js';

const router = express.Router();

router.get('/:uid',          controller.getCart);     // 장바구니 조회
router.post('/',             controller.addCart);     // 장바구니 추가
router.patch('/:cid',        controller.updateCount); // 수량 변경
router.delete('/:cid',       controller.deleteCart);  // 항목 삭제

export default router;
