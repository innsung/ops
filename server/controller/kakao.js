import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const KAKAO_SECRET_KEY = process.env.KAKAO_SECRET_KEY;
const CLIENT_ORIGIN    = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const SERVER_URL       = process.env.SERVER_URL     || 'http://localhost:9000';

// tid 임시 저장 (실제 서비스는 DB에 저장)
const tidStore = {};

/* ────────────────────────────────────────
   결제 준비 (Shoppy 패턴 동일)
──────────────────────────────────────── */
export const getReady = async (req, res, next) => {
    try {
        const { orderId, userId, itemName, quantity, totalAmount } = req.body;

        console.log('💳 [kakao/ready] 결제 준비 →', { orderId, userId, itemName, quantity, totalAmount });

        const response = await axios.post(
            'https://open-api.kakaopay.com/online/v1/payment/ready',
            {
                cid:              'TC0ONETIME',
                partner_order_id: orderId,
                partner_user_id:  userId,
                item_name:        itemName,
                quantity,
                total_amount:     totalAmount,
                vat_amount:       0,
                tax_free_amount:  0,
                approval_url: `${SERVER_URL}/api/kakao/approve?partner_order_id=${orderId}&partner_user_id=${userId}`,
                fail_url:     `${CLIENT_ORIGIN}/payresult?status=fail`,
                cancel_url:   `${CLIENT_ORIGIN}/payresult?status=cancel`,
            },
            {
                headers: {
                    Authorization:  `SECRET_KEY ${KAKAO_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const { tid, next_redirect_pc_url, next_redirect_mobile_url } = response.data;

        // tid 임시 저장 (승인 시 필요)
        tidStore[orderId] = { tid, userId, totalAmount };
        console.log('✅ [kakao/ready] 결제 준비 완료 → tid:', tid);

        res.json({ tid, next_redirect_pc_url, next_redirect_mobile_url });
    } catch (err) {
        console.error('❌ [kakao/ready] 에러:', err.response?.data || err.message);
        res.status(500).json({ message: '카카오페이 결제 준비 실패', error: err.response?.data });
    }
};

/* ────────────────────────────────────────
   결제 승인
──────────────────────────────────────── */
export const getApprove = async (req, res, next) => {
    try {
        const { pg_token, partner_order_id, partner_user_id } = req.query;
        const stored = tidStore[partner_order_id];

        if (!stored) {
            return res.redirect(`${CLIENT_ORIGIN}/payresult?status=fail`);
        }

        console.log('💳 [kakao/approve] 결제 승인 →', { pg_token, partner_order_id });

        const response = await axios.post(
            'https://open-api.kakaopay.com/online/v1/payment/approve',
            {
                cid:              'TC0ONETIME',
                tid:              stored.tid,
                partner_order_id,
                partner_user_id,
                pg_token,
            },
            {
                headers: {
                    Authorization:  `SECRET_KEY ${KAKAO_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('✅ [kakao/approve] 결제 승인 완료:', response.data.aid);

        // tid 삭제
        delete tidStore[partner_order_id];

        // 결제 완료 페이지로 리다이렉트
        const { amount, item_name, approved_at } = response.data;
        const params = new URLSearchParams({
            status:    'success',
            itemName:  item_name,
            amount:    amount.total,
            approvedAt: approved_at,
        });

        res.redirect(`${CLIENT_ORIGIN}/payresult?${params.toString()}`);
    } catch (err) {
        console.error('❌ [kakao/approve] 에러:', err.response?.data || err.message);
        res.redirect(`${CLIENT_ORIGIN}/payresult?status=fail`);
    }
};

/* ── 결제 실패 */
export const getFail = (req, res) => {
    res.redirect(`${CLIENT_ORIGIN}/payresult?status=fail`);
};

/* ── 결제 취소 */
export const getCancel = (req, res) => {
    res.redirect(`${CLIENT_ORIGIN}/payresult?status=cancel`);
};
