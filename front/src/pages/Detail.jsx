import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setWishCount, setCartCount } from "../store";
import { axiosPost } from "../utils/dataFetch";
import { formatPrice } from "../utils/cart";

// ── 별점 렌더링 헬퍼
function StarRating({ rating, size = 16 }) {
  return (
    <span style={{ color: "#f5a623", fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>{n <= rating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

// ── 날짜 포맷
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
}

export default function Detail({ prdlist }) {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const isLoggedIn  = useSelector((state) => state.user.isLoggedIn);
  const userId      = useSelector((state) => state.user.userId);
  const uid         = useSelector((state) => state.user.uid);

  const selProduct   = prdlist.find((x) => x.id === Number(id));
  const productPrice = Number(selProduct?.price || 0);

  const [qttval,       setQttval]       = useState(1);
  const [fade,         setFade]         = useState("");
  const [showPopup,    setShowPopup]    = useState(false);
  const [isWished,      setIsWished]      = useState(false);
  const [detailselect1, setDetailselect1] = useState(false);
  const [detailselect2, setDetailselect2] = useState(false);
  const [detailselect3, setDetailselect3] = useState(false);

  // ── 리뷰 관련 state
  const [reviews,     setReviews]     = useState([]);
  const [summary,     setSummary]     = useState({ reviewCount: 0, avgRating: 0 });
  const [showForm,    setShowForm]    = useState(false);
  const [newReview,   setNewReview]   = useState({ content: "", rating: 5 });
  const [submitMsg,   setSubmitMsg]   = useState("");

  const handleDirectOrder = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/Login");
      return;
    }

    const directOrderItem = {
      cid: selProduct.id,   
      name: selProduct.title,
      imgurl: selProduct.imgurl,
      ogprice: productPrice, 
      count: qttval,        
    };
    navigate("/order", { state: { directItems: [directOrderItem] } });
  };

  
  useEffect(() => {
    setFade("end");
    return () => setFade("");
  }, []);

  // ── 찜 여부 확인
  useEffect(() => {
    if (isLoggedIn && uid && id) {
      fetch(`/api/wishlist/check/${uid}/${id}`)
        .then((r) => r.json())
        .then((d) => setIsWished(d.isWished))
        .catch(() => {});
    }
  }, [id, uid, isLoggedIn]);

  // ── 찜 토글
  const handleToggleWish = async () => {
    if (!isLoggedIn) { alert("로그인이 필요합니다."); navigate("/Login"); return; }
    try {
      const res  = await fetch("/api/wishlist", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ uid, pid: Number(id) }),
      });
      const data = await res.json();
      setIsWished(data.isWished);
      dispatch(setWishCount(data.wishCount));
    } catch (err) { console.error("찜 토글 실패:", err); }
  };

  // ── 리뷰 fetch
  const fetchReviews = async () => {
    try {
      const res  = await fetch(`/api/reviews/${id}`);
      const data = await res.json();
      setReviews(data.reviews);
      setSummary(data.summary);
    } catch (err) {
      console.error("리뷰 로딩 실패:", err);
    }
  };

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  const totalPrice = qttval * productPrice;

  const downqttHandler = () => {
    if (qttval === 1) alert("최소 주문수량은 1개 입니다.");
    else setQttval((q) => q - 1);
  };
  const upqttHandler = () => setQttval((q) => q + 1);

  // ── 장바구니 담기 → DB API 연동
  const handleAddCart = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/Login");
      return;
    }
    try {
      await axiosPost("/cart", {
        uid,
        pid:   selProduct.id,
        count: qttval,
      });
      // 장바구니 카운트 업데이트
      const cartData = await (await fetch(`/api/cart/${uid}`)).json();
      dispatch(setCartCount(cartData.reduce((sum, item) => sum + item.count, 0)));
      setShowPopup(true);
    } catch (err) {
      console.error("장바구니 담기 실패:", err);
    }
  };

  // ── 리뷰 작성 제출
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/Login");
      return;
    }
    if (!newReview.content.trim()) {
      setSubmitMsg("리뷰 내용을 입력해주세요.");
      return;
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pid:     Number(id),
          uid:     uid,
          content: newReview.content,
          rating:  newReview.rating,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitMsg(data.message); return; }

      setSubmitMsg("리뷰가 등록되었습니다!");
      setNewReview({ content: "", rating: 5 });
      setShowForm(false);
      fetchReviews();   // 리뷰 목록 새로고침
    } catch (err) {
      setSubmitMsg("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div id="wrap" className={"start " + fade}>
        <div id="container">
          <main id="contents2">

            {/* ── 장바구니 팝업 ── */}
            {showPopup && (
              <div className="cart-popup-overlay">
                <div className="cart-popup">
                  <p>상품을 장바구니에 담았습니다.</p>
                  <strong>장바구니로 이동하시겠습니까?</strong>
                  <div className="cart-popup-buttons">
                    <button type="button" onClick={() => setShowPopup(false)}>쇼핑 계속하기</button>
                    <button type="button" className="btnsubmit" onClick={() => navigate("/cart")}>장바구니 가기</button>
                  </div>
                </div>
              </div>
            )}

            {/* breadcrumb */}
            <div className="path">
              <ol>
                <li><Link to="/">홈</Link></li>
                <li><span>{selProduct?.category}</span></li>
              </ol>
            </div>

            <div className="xansproductdetail">
              {/* ── 이미지 ── */}
              <div className="imgarea">
                <div className="clearfix">
                  <div className="prdimg">
                    <div className="thumbnail swipercontainer">
                      <ul className="swiperwrapper">
                        <li className="swiperslide2">
                          <img src={selProduct?.imgurl} alt={selProduct?.title} />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 상품 정보 ── */}
              <div className="infoarea">
                <div className="mainoptcontent">
                  <div className="headingarea"><h1>{selProduct?.title}</h1></div>
                  <div className="pricearea"><p>₩{formatPrice(productPrice)}</p></div>

                  <table>
                    <tbody style={{ display: "block" }}>
                      <tr>
                        <th><span className="purchasedetail">유통기한</span></th>
                        <td><span className="purchasedetail">{selProduct?.edate}</span></td>
                      </tr>
                      <tr>
                        <th><span className="purchasedetail">보관방법</span></th>
                        <td><span className="purchasedetail">{selProduct?.smethod}</span></td>
                      </tr>
                      <tr>
                        <th><span className="purchasedetail">배송비</span></th>
                        <td><span className="purchasedetail">3,000원 (30,000원 이상 구매 시 무료)</span></td>
                      </tr>
                    </tbody>
                  </table>

                  <div id="totalproducts">
                    <table>
                      <colgroup>
                        <col style={{ width: "142px" }} />
                        <col style={{ width: "147px" }} />
                        <col style={{ width: "137px" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>{selProduct?.title}</td>
                          <td>
                            <span className="quantity">
                              <input id="quantity" value={qttval} type="text" readOnly />
                              <a className="up quantityup"    onClick={upqttHandler}>수량증가</a>
                              <a className="down quantitydown" onClick={downqttHandler}>수량감소</a>
                            </span>
                          </td>
                          <td className="right">
                            <span className="quantityprice">₩{formatPrice(totalPrice)}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id="totalprice" className="totalprice">
                  <strong className="title">TOTAL</strong>
                  <span className="total">
                    <strong><em>₩{formatPrice(totalPrice)}</em></strong> ({qttval}개)
                  </span>
                </div>

                <div className="productaction xansproductaction">
                  <div className="flex">
                    <a className="btnsubmit gfull sizel" onClick={handleDirectOrder}><span>바로구매</span></a>
                    <span className="gactionbuttoncolumn">
                      <button type="button" className="btnnormal sizel actioncart" onClick={handleAddCart}>
                        <span><img src="/img/iconcart.svg" style={{ width: "15px", height: "15px" }} alt="cart" /></span>
                      </button>
                      <button type="button" className="btnnormal sizel actionwish"
                        onClick={handleToggleWish}
                        style={{ color: isWished ? "#e74c3c" : "#999" }}
                        title={isWished ? "관심상품 취소" : "관심상품 추가"}
                      >
                        <span style={{ fontSize: "16px" }}>{isWished ? "♥" : "♡"}</span>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 아코디언 ── */}
            <div className="xansproductdetaildesign">
              <div className="tabmenu">
                {[
                  { state: detailselect1, set: setDetailselect1, title: "상세정보",    content: "상품 상세 정보가 여기에 표시됩니다." },
                  { state: detailselect2, set: setDetailselect2, title: "픽업안내",    content: "발송일 지정을 원하시는 경우 주문 즉시 Q&A게시판에 문의를 남겨주세요." },
                  { state: detailselect3, set: setDetailselect3, title: "교환 및 반품정보", content: "상품을 공급받으신 날로부터 7일 이내 교환/반품 가능합니다." },
                ].map(({ state, set, title, content }) => (
                  <div key={title} className={"ecbasefold " + (state ? "selected" : "")} onClick={() => set(!state)}>
                    <div className="title"><h2>{title}</h2></div>
                    <div className="contents"><div className="info">{content}</div></div>
                  </div>
                ))}
              </div>

              {/* ────────────────────────────────────
                  상품 리뷰 섹션 (DB 연동)
              ──────────────────────────────────── */}
              <div id="prdreview" className="ecbasefold2">
                <div className="title titlenonfold flex flexvcenter flexhcenter relative">
                  <h2>상품리뷰 <span className="boardcount">{summary.reviewCount}</span></h2>
                </div>

                {/* 별점 요약 */}
                {summary.reviewCount > 0 && (
                  <div className="reviewsummary flex flexvcenter flexhcenter">
                    <div className="reviewsummarycolumn textcenter">
                      <div className="reviewsummarytitle">리뷰 평점</div>
                      <StarRating rating={Math.round(summary.avgRating)} size={24} />
                      <div className="reviewsummaryrate flex flexvcenter flexhcenter">
                        <div className="reviewsummaryper">{summary.avgRating}</div>
                        <div className="reviewsummarytotal">&nbsp;/ 5</div>
                      </div>
                    </div>
                    <div className="reviewsummarycolumn textcenter">
                      <div className="reviewsummarytitle">전체 리뷰수</div>
                      <div className="reviewsummaryrate flex flexvcenter flexhcenter">
                        <div className="reviewsummarycount" style={{ fontSize: "28px", fontWeight: "bold" }}>
                          {summary.reviewCount}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 리뷰 목록 */}
                <div className="contents2">
                  {reviews.length === 0 ? (
                    <p className="nodata">게시물이 없습니다</p>
                  ) : (
                    <ul className="review-list">
                      {reviews.map((review) => (
                        <li key={review.rid} className="review-item">
                          <div className="review-header">
                            <span className="review-user">{review.userId}</span>
                            <StarRating rating={review.rating} size={14} />
                            <span className="review-date">{formatDate(review.cdate)}</span>
                          </div>
                          <p className="review-content">{review.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* 리뷰 작성 버튼 / 폼 */}
                  <div className="ecbasebutton">
                    <span className="gright">
                      <a className="btnnormalfix sizem">전체 보기</a>
                      <a className="btnsubmitfix sizem"
                        onClick={() => isLoggedIn ? setShowForm(!showForm) : navigate("/Login")}>
                        리뷰작성
                      </a>
                    </span>
                  </div>

                  {/* ── 리뷰 작성 폼 ── */}
                  {showForm && (
                    <form className="review-form" onSubmit={handleReviewSubmit}>
                      {/* 별점 선택 */}
                      <div className="review-rating-select">
                        <label>별점 : </label>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            style={{
                              fontSize: "24px", cursor: "pointer",
                              color: n <= newReview.rating ? "#f5a623" : "#ccc",
                            }}
                            onClick={() => setNewReview((p) => ({ ...p, rating: n }))}
                          >★</span>
                        ))}
                      </div>
                      {/* 내용 입력 */}
                      <textarea
                        className="review-textarea"
                        placeholder="상품 리뷰를 작성해주세요. (최소 10자)"
                        value={newReview.content}
                        onChange={(e) => setNewReview((p) => ({ ...p, content: e.target.value }))}
                        rows={4}
                      />
                      {submitMsg && (
                        <p style={{ color: submitMsg.includes("등록") ? "green" : "red", fontSize: "13px" }}>
                          {submitMsg}
                        </p>
                      )}
                      <div className="review-form-btns">
                        <button type="submit" className="btnsubmitfix sizem">등록</button>
                        <button type="button" className="btnnormalfix sizem"
                          onClick={() => { setShowForm(false); setSubmitMsg(""); }}>
                          취소
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* ── 상품 QnA ── */}
              <div id="prdqna" className="ecbasefold2">
                <div className="title titlenonfold flex flexvcenter flexhcenter relative">
                  <h2>상품문의 <span className="boardcount">0</span></h2>
                </div>
                <div className="contents2">
                  <p className="nodata">게시물이 없습니다</p>
                  <div className="ecbasebutton">
                    <span className="gright">
                      <a className="btnnormalfix sizem">전체 보기</a>
                      <a className="btnsubmitfix sizem">상품문의하기</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}
