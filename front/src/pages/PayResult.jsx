import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../store";
import { formatPrice } from "../utils/cart";

export default function PayResult() {
  const navigate      = useNavigate();
  const dispatch      = useDispatch();
  const [params]      = useSearchParams();

  const status     = params.get("status");
  const itemName   = params.get("itemName");
  const amount     = params.get("amount");
  const approvedAt = params.get("approvedAt");

  // 결제 성공 시 장바구니 비우기
  useEffect(() => {
    if (status === "success") {
      dispatch(clearCart());
    }
  }, [status, dispatch]);

  return (
    <div id="container">
      <div id="contents" className="blanktop blankbottom">

        {/* 단계 표시 */}
        <div className="ecbasestep">
          <ol>
            <li>1. 장바구니</li>
            <li>2. 주문서작성</li>
            <li className="selected">3. 주문완료</li>
          </ol>
        </div>

        <div className="payresult-wrap">

          {/* ── 결제 성공 ── */}
          {status === "success" && (
            <div className="payresult-box payresult-success">
              <div className="payresult-icon">✅</div>
              <h2>결제가 완료되었습니다!</h2>
              <p>주문해 주셔서 감사합니다.</p>
              <div className="payresult-info">
                <div className="payresult-info-row">
                  <span>상품명</span>
                  <strong>{itemName}</strong>
                </div>
                <div className="payresult-info-row">
                  <span>결제금액</span>
                  <strong>₩{formatPrice(Number(amount))}</strong>
                </div>
                {approvedAt && (
                  <div className="payresult-info-row">
                    <span>결제일시</span>
                    <strong>{new Date(approvedAt).toLocaleString("ko-KR")}</strong>
                  </div>
                )}
              </div>
              <div className="payresult-btns">
                <button className="btnsubmit sizem" onClick={() => navigate("/")}>
                  홈으로
                </button>
                <button className="btnnormal sizem" onClick={() => navigate("/shop")}>
                  쇼핑 계속하기
                </button>
              </div>
            </div>
          )}

          {/* ── 결제 실패 ── */}
          {status === "fail" && (
            <div className="payresult-box payresult-fail">
              <div className="payresult-icon">❌</div>
              <h2>결제에 실패했습니다.</h2>
              <p>다시 시도하거나 다른 결제 수단을 이용해주세요.</p>
              <div className="payresult-btns">
                <button className="btnsubmit sizem" onClick={() => navigate("/order")}>
                  다시 시도
                </button>
                <button className="btnnormal sizem" onClick={() => navigate("/")}>
                  홈으로
                </button>
              </div>
            </div>
          )}

          {/* ── 결제 취소 ── */}
          {status === "cancel" && (
            <div className="payresult-box payresult-cancel">
              <div className="payresult-icon">🚫</div>
              <h2>결제가 취소되었습니다.</h2>
              <p>결제를 취소하셨습니다. 장바구니로 돌아가시겠습니까?</p>
              <div className="payresult-btns">
                <button className="btnsubmit sizem" onClick={() => navigate("/cart")}>
                  장바구니로
                </button>
                <button className="btnnormal sizem" onClick={() => navigate("/")}>
                  홈으로
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
