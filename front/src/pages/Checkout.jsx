import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'; // 💡 1. 가방을 열어보기 위한 훅 추가!
import { getTotalPrice, getDeliveryFee, formatPrice } from "../utils/cart";

export default function Checkout() {
  const location = useLocation(); // 💡 2. 가방 객체 가져오기
  const { userId } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart) || [];

  // 🔍 3. [비밀 가방 검사] 상세페이지에서 '바로구매'로 보낸 데이터가 들어있는지 확인
  const directItem = location.state?.directItem;

  // 🛡️ 4. 삼항연산자 방어막: 바로구매 데이터가 있으면 걔만 배열로 쓰고, 없으면 장바구니 전체를 채택!
  const checkoutItems = directItem ? [directItem] : cartItems;

  // 💸 5. 금액 계산은 어떤 경로로 왔든 checkoutItems를 바라보므로 자동 연동됩니다!
  const totalPrice  = getTotalPrice(checkoutItems);
  const deliveryFee = getDeliveryFee(totalPrice);
  const allPrice    = totalPrice + deliveryFee;

  // 사용자 기본 정보
  const [receiver, setReceiver] = useState({
    name: '홍길동', phone: '010-1234-1234',
    zipcode: '12345', address1: '서울시 강남구 역삼동',
    address2: '123', memo: '문앞',
  });

  return (
    <div id="contents2" className="container blanktop">
      <div className="titlearea">
        {/* 💡 상단 제목에 현재 구매 방식을 친절하게 띄워주면 디버깅할 때 아주 편합니다. */}
        <h2>주문서작성 / 결제 ({directItem ? "바로구매" : "장바구니"})</h2>
      </div>

      <div className="checkout-container" style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        
        {/* 1. 왼쪽: 주문자 정보 및 배송지 입력 폼 */}
        <div className="checkout-form" style={{ flex: 1, border: "1px solid #ddd", padding: "20px" }}>
          <h3>📦 배송 정보</h3>
          <p><strong>주문자:</strong> {userId}님</p>
          <div className="section">
            <h2 className="section-title">받는사람정보</h2>
            <div className="info-box">
              <div className="info-grid">
                <div className="label">이름</div><div className="value">{receiver.name}</div>
                <div className="label">배송주소</div>
                <div className="value">{receiver.zipcode} / {receiver.address1} {receiver.address2}</div>
                <div className="label">연락처</div><div className="value">{receiver.phone}</div>
                <div className="label">배송 요청사항</div>
                <div className="value phone-input">
                  <input type="text" defaultValue={receiver.memo} />
                  <button className="btn">변경</button>
                </div>
              </div>
            </div>
          </div>

          {/* 💡 [추가] 내가 주문할 빵 리스트 요약창 얹어주기 */}
          <div className="section" style={{ marginTop: "20px" }}>
            <h2 className="section-title">주문 상품 정보 ({checkoutItems.length}건)</h2>
            <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
              {checkoutItems.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px dashed #eee" }}>
                  <img src={item.imgurl} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: "14px" }}>{item.name}</strong>
                    <p style={{ fontSize: "12px", color: "#666" }}>₩{formatPrice(item.ogprice)} / {item.count}개</p>
                  </div>
                  <div style={{ fontWeight: "bold" }}>
                    ₩{formatPrice(item.ogprice * item.count)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 2. 오른쪽: 최종 결제 금액 요약 및 카카오페이 버튼 */}
        <div className="checkout-summary" style={{ width: "350px", border: "1px solid #ddd", padding: "20px", background: "#fafafa" }}>
          <h3>💳 결제 예정 금액</h3>
          <div style={{ margin: "15px 0" }}>
            <p>총 상품 금액: ₩{formatPrice(totalPrice)}</p>
            <p>배송비: ₩{formatPrice(deliveryFee)}</p>
            <hr />
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#e74c3c" }}>
              최종 결제 금액: ₩{formatPrice(allPrice)}
            </p>
          </div>
          
          <button className="btnsubmit gfull sizel" style={{ background: "#fee500", color: "#222", border: "none", fontWeight: "bold" }}>
            카카오페이로 안전결제
          </button>
        </div>

      </div>
    </div>
  );
}