import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import * as repository from '../repository/auth.js';

/* ────────────────────────────────────────
   토큰 설정 (환경변수)
──────────────────────────────────────── */
const ACCESS_SECRET   = () => process.env.ACCESS_SECRET  || process.env.JWT_SECRET;
const REFRESH_SECRET  = () => process.env.REFRESH_SECRET || process.env.JWT_SECRET;
const ACCESS_EXPIRES  = process.env.ACCESS_EXPIRES  || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || '7d';

/* ────────────────────────────────────────
   회원가입
──────────────────────────────────────── */
export const join = async (req, res, next) => {
    try {
        const { id, pwd, name, phone, email } = req.body;

        if (!id || !pwd || !name) {
            return res.status(400).json({ message: '필수 항목을 입력해주세요.' });
        }

        const existing = await repository.findById(id);
        if (existing) {
            return res.status(409).json({ message: '이미 사용 중인 아이디입니다.' });
        }

        const hashedPwd = await bcrypt.hash(pwd, 10);
        await repository.createUser({ id, pwd: hashedPwd, name, phone, email });
        res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (err) {
        next(err);
    }
};

/* ────────────────────────────────────────
   로그인 — AccessToken + RefreshToken 발급
──────────────────────────────────────── */
export const login = async (req, res, next) => {
    try {
        const { id, pwd } = req.body;

        if (!id || !pwd) {
            return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
        }

        const user = await repository.findById(id);
        if (!user) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        }

        const isMatch = await bcrypt.compare(pwd, user.pwd);
        if (!isMatch) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        }

        // ✅ DB에서 읽은 실제 role 사용
        const payload = { uid: user.uid, id: user.id, role: user.role };

        const accessToken  = jwt.sign(payload, ACCESS_SECRET(),  { expiresIn: ACCESS_EXPIRES });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET(), { expiresIn: REFRESH_EXPIRES });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure:   false,
            sameSite: 'lax',
            maxAge:   7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message:     '로그인 성공',
            accessToken,
            uid:         user.uid,
            userId:      user.id,
            role:        user.role,  // ✅ 실제 role 반환
        });
    } catch (err) {
        next(err);
    }
};

/* ────────────────────────────────────────
   AccessToken 재발급
──────────────────────────────────────── */
export const refresh = async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;
    console.log('\n🍪 [refresh] 쿠키 수신:', refreshToken ? '있음' : '없음');

    if (!refreshToken) {
        return res.status(401).json({ message: 'refreshToken 없음' });
    }

    try {
        const decoded     = jwt.verify(refreshToken, REFRESH_SECRET());
        const accessToken = jwt.sign(
            { uid: decoded.uid, id: decoded.id, role: decoded.role },
            ACCESS_SECRET(),
            { expiresIn: ACCESS_EXPIRES }
        );

        console.log('✅ [refresh] 새 accessToken 발급 완료 → userId:', decoded.id);

        return res.json({
            accessToken,
            uid:    decoded.uid,
            userId: decoded.id,
            role:   decoded.role,  // ✅ role 포함
        });
    } catch (err) {
        console.error('❌ [refresh] 토큰 검증 실패:', err.message);
        res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        return res.status(401).json({ message: 'refreshToken 만료' });
    }
};

/* ────────────────────────────────────────
   verifyToken 미들웨어
──────────────────────────────────────── */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: '토큰 없음' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET());
        req.user = decoded;
        next();
    } catch (err) {
        console.log('⏰ [verifyToken] 토큰 만료:', err.message);
        return res.status(401).json({ message: '토큰 만료 또는 유효하지 않음' });
    }
};

/* ────────────────────────────────────────
   verifyAdmin 미들웨어 — 관리자 전용
──────────────────────────────────────── */
export const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: '토큰 없음' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET());
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: '관리자 권한이 없습니다.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: '토큰 만료 또는 유효하지 않음' });
    }
};

/* ────────────────────────────────────────
   로그아웃
──────────────────────────────────────── */
export const logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure:   false,
        sameSite: 'lax',
    });
    return res.json({ message: '로그아웃 되었습니다.' });
};
