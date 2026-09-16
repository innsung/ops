import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setWishCount, setCartCount } from "../store";
import { axiosPost } from "../utils/dataFetch";
import { formatPrice } from "../utils/cart";

import bannerdata from "../bannerdata";
import instadata  from "../instadata";

import Product  from "../components/Product";
import Bancon   from "../components/Bancon";
import Instacon from "../components/Instacon";

const SLIDES = [1, 2, 3, 4];

function priceChange(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Home({ prdlist }) {
  const navigate = useNavigate();
  const { id }      = useParams();
  
  /* ── 🚨 dispatch 추가 선언 ── */
  const dispatch = useDispatch(); 

  /* ── 메인 슬라이더 ── */
  const [index, setIndex] = useState(1);

  const prevHandler = () => setIndex((cur) => (cur === 1 ? 4 : cur - 1));
  const nextHandler = () => setIndex((cur) => (cur === 4 ? 1 : cur + 1));

  const isLoggedIn  = useSelector((state) => state.user.isLoggedIn);
  const userId      = useSelector((state) => state.user.userId);
  const [showPopup,    setShowPopup]    = useState(false);
  const [isWished,     setIsWished]     = useState(false);

  const uid         = useSelector((state) => state.user.uid);
  const selProduct   = prdlist.find((x) => x.id === Number(id));

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((cur) => (cur === 4 ? 1 : cur + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  /* ── MD Choice ── */
  const [qttval,   setQttval]   = useState(1);
  const [imgindex, setImgindex] = useState(1);
  const mdPrice = qttval * 8000;

  const downqttHandler = () => {
    if (qttval === 1) alert("최소 주문수량은 1개 입니다.");
    else setQttval((q) => q - 1);
  };
  const upqttHandler = () => setQttval((q) => q + 1);

  // 슬라이드 translateX 값 매핑
  const translateMap = { 1: "0%", 2: "-100%", 3: "-200%", 4: "-300%" };

  /* ────────────────────────────────────────────────────────────
  2026-05-29 insung 수정 detail handleDirectOrder 함수 활용, 수정(바로 구매 기능)
  ──────────────────────────────────────────────────────────── */
  const handleDirectOrder = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/Login");
      return;
    }

    // 1. prdlist에서 17번 MD Choice 상품의 원래 정보를 찾습니다.(상품정보 17번으로 고정)
    const choiceProduct = prdlist.find((x) => x.id === 17);

    if (!choiceProduct) {
      alert("상품 정보를 불러올 수 없습니다.");
      return;
    }

    // 2. 주문 페이지(/order)로 넘겨줄 데이터 구조를 생성합니다.
    const directOrderItem = {
      cid: choiceProduct.id,   
      name: choiceProduct.title || "뺑 드 세글", // 만약 DB에 없으면 기본 텍스트 유지
      imgurl: choiceProduct.imgurl || `/img/choice1.jpg`,
      ogprice: Number(choiceProduct.price || 8000), // 선택한 상품의 개당 단가
      count: qttval, // 사용자가 수량 버튼으로 조절한 수량(qttval)
    };

    // 3. 데이터를 state에 실어서 주문 페이지로 이동합니다.
    navigate("/order", { state: { directItems: [directOrderItem] } });
  };
  /* ────────────────────────────────────────────────────────────
  바로구매 로직 종료
  ──────────────────────────────────────────────────────────── */

  /* ────────────────────────────────────────────────────────────
  2026-05-29 insung 수정 detail handleAddCart 함수 활용, 수정(장바구니 기능)
  ──────────────────────────────────────────────────────────── */
  const handleAddCart = async (product) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/Login");
      return;
    }

    // 1. 유저 ID(uid) 검증
    if (!uid) {
      alert("로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.");
      console.error("장바구니 담기 실패: uid 값이 없습니다.", { uid });
      return;
    }

    // 2. 상품 정보 검증
    if (!product || !product.id) {
      alert("상품 정보를 불러올 수 없습니다.");
      return;
    }

    try {
      // 서버 전송 전 데이터 로그 확인용 (개발자 도구 콘솔에서 확인 가능)
      console.log("서버로 보내는 장바구니 데이터:", {
        uid: uid,
        pid: Number(product.id),
        count: Number(product.count || 1)
      });

      // 3. 데이터를 확실하게 숫자(Number) 타입으로 변환하여 전송
      await axiosPost("/cart", {
        uid: uid,
        pid: Number(product.id),        // 숫자로 확실히 변환
        count: Number(product.count || 1), // 숫자로 확실히 변환
      });

      // 장바구니 카운트 업데이트
      const cartData = await (await fetch(`/api/cart/${uid}`)).json();
      dispatch(setCartCount(cartData.reduce((sum, item) => sum + item.count, 0)));
      
      setShowPopup(true);
      alert("장바구니에 상품이 담겼습니다.");
    } catch (err) {
      console.error("장바구니 담기 실패 (서버 500 에러 발생 시 여기 확인):", err);
      alert("서버 오류로 장바구니에 담지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  };
  /* ────────────────────────────────────────────────────────────
    장바구니 함수 종료
  ──────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (isLoggedIn && uid) {
      fetch(`/api/wishlist/check/${uid}/17`) // 👈 id 대신 16으로 고정
        .then((r) => r.json())
        .then((d) => setIsWished(d.isWished))
        .catch(() => {});
    }
  }, [uid, isLoggedIn]);

  /* ────────────────────────────────────────────────────────────
  2026-05-29 insung 수정 detail handleToggleWish 함수 활용, 수정(wishlist 기능)
  ──────────────────────────────────────────────────────────── */
  const handleToggleWish = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/Login");
      return;
    }
    
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid: 17 }), // 👈 Number(id) 대신 17으로 고정
      });
      const data = await res.json();
      setIsWished(data.isWished);
      dispatch(setWishCount(data.wishCount)); // 헤더 찜 카운트 업데이트
      
      if (data.isWished) {
        alert("관심 상품에 등록되었습니다.");
      } else {
        alert("관심 상품에서 삭제되었습니다.");
      }
    } catch (err) {
      console.error("찜 토글 실패:", err);
    }
  };
  /* ────────────────────────────────────────────────────────────
    wishlist 함수 종료
  ──────────────────────────────────────────────────────────── */

  return (
    <div id="wrap">
      <div id="container">
        <main id="contents">

          {/* 메인 슬라이더 */}
          <div className="mainbanner relative">
            <div className="mainbannercontainer swipercontainer swipercontainerfade">
              <div className="mainbannerwrapper swiperwrapper" style={{ cursor: "pointer" }}>
                {SLIDES.map((n) => (
                  <div
                    key={n}
                    className={"mainbanneritem swiperslide " + (index === n ? "on" : "")}
                    style={{
                      width: "100%",
                      transform: `translate3d(${translateMap[n]}, 0px, 0px)`,
                      transition: "1s",
                    }}
                  >
                    <a><img src={`/img/sliderimg${n}.jpg`} alt={`slide${n}`} /></a>
                  </div>
                ))}

                <div className="mainbannernav mainbannernavprev" onClick={prevHandler}>
                  <img src="/img/prev.png" alt="prev" />
                </div>
                <div className="mainbannernav mainbannernavnext" onClick={nextHandler}>
                  <img src="/img/next.png" alt="next" />
                </div>

                <div className="mainbannerpager">
                  {SLIDES.map((n) => (
                    <span
                      key={n}
                      className={"swiperpaginationbullet " + (index === n ? "active" : "")}
                      onClick={() => setIndex(n)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 서브 배너 3개 */}
          <section className="subbanner section scrolleffect on">
            <div className="subbannercontainer">
              <div className="subbannerlist inline">
                {bannerdata.map((b, i) => (
                  <Bancon key={b.id} banner={b} i={i + 1} />
                ))}
              </div>
            </div>
          </section>

          {/* OPS Video */}
          <section className="section">
            <div className="maintitlewrap scrolleffect on">
              <div className="maintitle textcenter">OPS Video</div>
            </div>
            <div className="videowrap">
              <iframe
                width="1180"
                height="664"
                src="https://www.youtube.com/embed/aK1Eny1LRuo?si=uN_Opd0upkqLgUDU"
                title="[OPS] 맛과 영양을 함께 챙긴 건강간식 학원전"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          </section>

          {/* Best Sellers */}
          <section className="section ecbaseproduct">
            <div className="maintitlewrap scrolleffect on">
              <div className="mainsubtitle textcenter">이달의 베스트 아이템</div>
              <div className="maintitle textcenter">Best Sellers</div>
            </div>
            <div className="productcontainer scrolleffect on">
              <ul className="prdlist grid4">
                {prdlist.slice(0, 8).map((product) => (
                  <Product key={product.id} product={product} />
                ))}
              </ul>
            </div>
          </section>

          {/* New Arrivals */}
          <section className="section ecbaseproduct">
            <div className="maintitlewrap scrolleffect on">
              <div className="mainsubtitle textcenter">새로나온 신상품</div>
              <div className="maintitle textcenter">New Arrivals</div>
            </div>
            <div className="productcontainer scrolleffect on">
              <ul className="prdlist grid4">
                {prdlist.slice(8, 16).map((product) => (
                  <Product key={product.id} product={product} />
                ))}
              </ul>
            </div>
          </section>

          {/* MD Choice */}
          <div className="newproducts section relative">
            <div className="maintitlewrap scrolleffect on">
              <div className="mainsubtitle textcenter">이건 꼭 사야돼!</div>
              <div className="maintitle textcenter">MD Choice</div>
            </div>
            <div className="newproductcontent scrolleffect relative on">
              <div id="mainprddetail" className="xansproductdetail">
                <div className="detailarea flex flexvcenter">

                  {/* 이미지 영역 */}
                  <div className="imgarea">
                    <div className="prdimg">
                      <div className="thumbnail">
                        <a onClick={() => navigate("/detail/16")} style={{ cursor: "pointer" }}>
                          <img src={`/img/choice${imgindex}.jpg`} alt="MD Choice" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 정보 영역 */}
                  <div className="infoarea">
                    <div className="mainoptcontent">
                      <div className="headingarea"><h1>뺑 드 세글</h1></div>
                      <div className="pricearea"><p>₩8,000</p></div>
                      <div id="totalproducts">
                        <table>
                          <colgroup>
                            <col style={{ width: "142px" }} />
                            <col style={{ width: "147px" }} />
                            <col style={{ width: "137px" }} />
                          </colgroup>
                          <tbody>
                            <tr>
                              <td>뺑 드 세글</td>
                              <td>
                                <span className="quantity">
                                  <input id="quantity" value={qttval} type="text" readOnly />
                                  <a className="up quantityup" onClick={upqttHandler}>수량증가</a>
                                  <a className="down quantitydown" onClick={downqttHandler}>수량감소</a>
                                </span>
                              </td>
                              <td className="right">
                                <span className="quantityprice">₩{priceChange(mdPrice)}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div id="totalprice" className="totalprice">
                      <strong className="title">TOTAL</strong>
                      <span className="total">
                        <strong><em>₩{priceChange(mdPrice)}</em></strong> ({qttval}개)
                      </span>
                    </div>
                    <div className="productaction xansproductaction">
                      <div className="flex">
                        <a className="btnsubmit gfull sizel" onClick={handleDirectOrder}> {/* onClick 추가*/}
                          <span id="actionbuy">바로구매</span>
                        </a>
                        <span className="gactionbuttoncolumn">
                          
                          {/* ────────────────────────────────────────────────────────────
                            2026-05-29 insung 수정 MD Choice 상품(id: 17) 객체 정보와 수량(qttval)을 함께 넘김
                          ──────────────────────────────────────────────────────────── */}
                          <button 
                            type="button" 
                            className="btnnormal sizel actioncart" 
                            onClick={() => {
                              const choiceProduct = prdlist.find(x => x.id === 17);
                              if (choiceProduct) {
                                handleAddCart({ ...choiceProduct, count: qttval });
                              } else {
                                alert("상품 정보를 찾을 수 없습니다.");
                              }
                            }}
                          >
                            <span>
                              <img src="/img/iconcart.svg" style={{ width: "15px", height: "15px" }} alt="cart" />
                            </span>
                          </button>
                          {/* ────────────────────────────────────────────────────────────
                            장바구니 버튼 수정 완료
                          ──────────────────────────────────────────────────────────── */}

                          <button type="button" className="btnnormal sizel actionwish"
                            onClick={handleToggleWish}  
                            style={{ color: isWished ? "#e74c3c" : "#999" }}
                            title={isWished ? "관심상품 취소" : "관심상품 추가"}
                          > {/* onClick 추가*/}
                            <span style={{ fontSize: "16px" }}>{isWished ? "♥" : "♡"}</span>
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 썸네일 이미지 목록 */}
                <div className="listimg">
                  <div className="inner">
                    <ul className="list">
                      {[1, 2, 3, 4].map((n) => (
                        <li key={n} className="listitem">
                          <img
                            src={`/img/choice${n}.jpg`}
                            alt={`choice${n}`}
                            onMouseEnter={() => setImgindex(n)}
                            style={{ cursor: "pointer" }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instagram */}
          <div className="instagram section sectionnomargin">
            <div className="maintitlewrap scrolleffect on">
              <div className="mainsubtitle textcenter">@opsbakery_</div>
              <div className="maintitle textcenter">instagram</div>
            </div>
            <div className="instagramfeed scrolleffect on">
              <div style={{ marginLeft: "-5px" }}>
                <ul className="mediagrid clearfix">
                  {instadata.map((item, i) => (
                    <Instacon key={i} insta={item} i={i + 1} />
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}