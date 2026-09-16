import express    from 'express';
import * as controller from '../controller/review.js';

const router = express.Router();

router.get('/:pid',   controller.getReviews);   // 상품 리뷰 목록
router.post('/',      controller.createReview);  // 리뷰 작성

export default router;
