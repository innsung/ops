import express    from 'express';
import * as controller from '../controller/products.js';

const router = express.Router();

router.get('/',              controller.getAll);       // 전체 상품
router.get('/:pid',          controller.getProduct);   // 상품 상세
router.get('/:pid/qna',      controller.getQna);       // 상품 QnA

export default router;
