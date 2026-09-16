import express     from 'express';
import cors        from 'cors';
import dotenv      from 'dotenv';
import cookieParser from 'cookie-parser';

import productsRouter from './routes/products.js';
import authRouter     from './routes/auth.js';
import cartRouter     from './routes/cart.js';
import reviewRouter   from './routes/review.js';
import wishlistRouter from './routes/wishlist.js';
import kakaoRouter    from './routes/kakao.js';
import communityRouter from  './routes/community.js'
import adminRouter from './routes/admin.js';


dotenv.config();

const PORT   = process.env.SERVER_PORT || 5000;
const ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const app    = express();

// ── 미들웨어
app.use(cors({
    origin:       ORIGIN,
    credentials:  true,                                    // 쿠키 주고받기
    methods:      ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());   // req.cookies 사용 가능
app.use(express.json());

// ── 라우팅
app.use('/api/products', productsRouter);
app.use('/api/auth',     authRouter);
app.use('/api/cart',     cartRouter);
app.use('/api/reviews',  reviewRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/kakao',    kakaoRouter);
app.use('/api/community',    communityRouter);
app.use('/api/admin', adminRouter);


// ── 서버 시작
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ OPS 서버 실행 => http://localhost:${PORT}`);
});
