import express    from 'express';
import * as controller from '../controller/auth.js';

const router = express.Router();

router.post('/join',    controller.join);     // 회원가입
router.post('/login',   controller.login);    // 로그인
router.post('/logout',  controller.logout);   // 로그아웃
router.post('/refresh', controller.refresh);  // AccessToken 재발급 (신규)

export default router;
