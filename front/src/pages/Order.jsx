import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from 'react-router-dom';
import { axiosGet, axiosPost } from "../utils/dataFetch";
import { formatPrice, getDeliveryFee } from "../utils/cart";

export default function Order() {
  const navigate   = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const uid        = useSelector((state) => state.user.uid);
  const userId     = useSelector((state) => state.user.userId);

  const [cartItems, setCartItems] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [payment,   setPayment]   = useState("kakao");
  const [terms,     setTerms]     = useState(false);
  const [privacy,   setPrivacy]   = useState(false);
  const [receiver,  setReceiver]  = useState({
    name: "", phone: "", zipcode: "", address1: "", address2: "", memo: "문앞에 놔주세요",
  });
  const directItems = location.state?.directItems;

 useEffect(() => {
    if (directItems && directItems.length > 0) {
      setCartItems(directItems);
      setLoading(false);
    } 
    else {
      if (!isLoggedIn || !uid) {
        setLoading(false);
        return;
      }
      axiosGet(`/cart/${uid}`)
        .then((data) => setCartItems(data))
        .catch((err) => console.error("장바구니 로딩 실패:", err))
        .finally(() => setLoading(false));
    }
  }, [uid, isLoggedIn, directItems]);

  const totalPrice  = cartItems.reduce((sum, item) => sum + item.ogprice * item.count, 0);
  const deliveryFee = getDeliveryFee(totalPrice);
  const allPrice    = totalPrice + deliveryFee;

  const handleReceiverChange = (e) => {
    const { name, value } = e.target;
    setReceiver((prev) => ({ ...prev, [name]: value }));
  };

  // ── 결제하기 (카카오페이 연동)
  const handlePayment = async () => {
    if (!receiver.name)     { alert("받는분 이름을 입력해주세요."); return; }
    if (!receiver.phone)    { alert("연락처를 입력해주세요."); return; }
    if (!receiver.address1) { alert("주소를 입력해주세요."); return; }
    if (!terms || !privacy) { alert("필수 약관에 모두 동의해야 결제가 가능합니다."); return; }

    if (payment === "kakao") {
      try {
        const orderId  = uuidv4();
        const itemName = cartItems.length > 1
          ? `${cartItems[0].name} 외 ${cartItems.length - 1}건`
          : cartItems[0].name;

        const result = await axiosPost("/kakao/ready", {
          orderId,
          userId,
          itemName,
          quantity:    cartItems.reduce((sum, i) => sum + i.count, 0),
          totalAmount: allPrice,
        });

        console.log("✅ 카카오페이 준비 완료:", result);

        // PC: next_redirect_pc_url / 모바일: next_redirect_mobile_url
        if (result.next_redirect_pc_url) {
          window.location.href = result.next_redirect_pc_url;
        }
      } catch (err) {
        console.error("카카오페이 오류:", err);
        alert("결제 준비 중 오류가 발생했습니다.");
      }
    } else {
      alert("네이버페이 결제 기능은 준비 중입니다.");
    }
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div id="container">
      <div id="contents2" className="blanktop">

        {/* 단계 표시 */}
        <div className="ecbasestep">
          <ol>
            <li><a onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>1. 장바구니</a></li>
            <li className="selected">2. 주문서작성</li>
            <li>3. 주문완료</li>
          </ol>
        </div>

        {/* ── 받는사람 정보 ── */}
        <div className="order-section">
          <h2 className="order-section-title">받는사람 정보</h2>
          <div className="order-form">
            <div className="order-form-row">
              <label>이름 *</label>
              <input type="text" name="name" value={receiver.name}
                onChange={handleReceiverChange} placeholder="이름 입력" />
            </div>
            <div className="order-form-row">
              <label>연락처 *</label>
              <input type="text" name="phone" value={receiver.phone}
                onChange={handleReceiverChange} placeholder="010-0000-0000" />
            </div>
            <div className="order-form-row">
              <label>주소 *</label>
              <div className="order-address">
                <input type="text" name="zipcode" value={receiver.zipcode}
                  onChange={handleReceiverChange} placeholder="우편번호"
                  style={{ width: "120px" }} />
                <button type="button" className="btnnormal sizem"
                  onClick={() => alert("우편번호 찾기는 준비 중입니다.")}>
                  우편번호 찾기
                </button>
              </div>
              <input type="text" name="address1" value={receiver.address1}
                onChange={handleReceiverChange} placeholder="기본주소"
                style={{ marginTop: "6px" }} />
              <input type="text" name="address2" value={receiver.address2}
                onChange={handleReceiverChange} placeholder="상세주소"
                style={{ marginTop: "6px" }} />
            </div>
            <div className="order-form-row">
              <label>배송 요청사항</label>
              <select name="memo" value={receiver.memo} onChange={handleReceiverChange}>
                <option>문앞에 놔주세요</option>
                <option>경비실에 맡겨주세요</option>
                <option>직접 받겠습니다</option>
                <option>배송 전 연락 바랍니다</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── 주문 상품 ── */}
        <div className="order-section">
          <h2 className="order-section-title">주문 상품</h2>
          <div className="order-product-list">
            {cartItems.map((item) => (
              <div key={item.cid} className="order-product-item">
                <img src={item.imgurl} alt={item.name} />
                <div className="order-product-info">
                  <strong>{item.name}</strong>
                  <p>수량: {item.count}개</p>
                  <p>₩{formatPrice(item.ogprice * item.count)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 결제 정보 ── */}
        <div className="order-section">
          <h2 className="order-section-title">결제 정보</h2>
          <table className="order-price-table">
            <tbody>
              <tr><td>총 상품금액</td><td>₩{formatPrice(totalPrice)}</td></tr>
              <tr><td>배송비</td><td>₩{formatPrice(deliveryFee)}</td></tr>
              <tr className="order-total-row">
                <td>총 결제금액</td>
                <td className="order-total-price">₩{formatPrice(allPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── 결제 수단 ── */}
        <div className="order-section">
          <h2 className="order-section-title">결제 수단</h2>
          <div className="order-payment-methods">
            <label className="order-payment-label">
              <input type="radio" name="payment" value="kakao"
                checked={payment === "kakao"}
                onChange={(e) => setPayment(e.target.value)} />
              카카오페이
            </label>
            <label className="order-payment-label">
              <input type="radio" name="payment" value="naver"
                checked={payment === "naver"}
                onChange={(e) => setPayment(e.target.value)} />
              네이버페이
            </label>
          </div>
        </div>

        {/* ── 약관 동의 ── */}
        <div className="order-terms">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" id="terms" checked={terms}
              onChange={(e) => setTerms(e.target.checked)} />
            <label htmlFor="terms">
              구매조건 확인 및 결제대행 서비스 약관 동의 <span>(필수)</span>
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" id="privacy" checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)} />
            <label htmlFor="privacy">
              개인정보 국외 이전 동의 <span>(필수)</span>
            </label>
          </div>
        </div>

        {/* ── 결제 버튼 ── */}
        <div className="order-pay-btn">
          <button className="btnsubmit gfull sizel" onClick={handlePayment}>
            ₩{formatPrice(allPrice)} 결제하기
          </button>
        </div>

      </div>
    </div>
  );
}
