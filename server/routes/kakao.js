import express    from 'express';
import * as controller from '../controller/kakao.js';
import { verifyToken } from '../controller/auth.js';

const router = express.Router();

router.post('/ready',   verifyToken, controller.getReady);    // 결제 준비
router.get('/approve',               controller.getApprove);  // 결제 승인 (redirect)
router.get('/fail',                  controller.getFail);     // 결제 실패
router.get('/cancel',                controller.getCancel);   // 결제 취소

export default router;
