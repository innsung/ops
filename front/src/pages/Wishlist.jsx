import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishCount } from "../store";
import { formatPrice } from "../utils/cart";

export default function Wishlist() {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const uid        = useSelector((state) => state.user.uid);

  const [wishlist, setWishlist] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // 비로그인 차단
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/Login");
    }
  }, [isLoggedIn, navigate]);

  // 관심상품 목록 fetch
  const fetchWishlist = async () => {
    try {
      const res  = await fetch(`/api/wishlist/${uid}`);
      const data = await res.json();
      setWishlist(data);
      dispatch(setWishCount(data.length));
    } catch (err) {
      console.error("관심상품 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && uid) fetchWishlist();
  }, [uid, isLoggedIn]);

  // 찜 취소
  const handleRemove = async (pid) => {
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid }),
      });
      fetchWishlist();
    } catch (err) {
      console.error("찜 취소 실패:", err);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div id="container">
      <div id="contents" className="blanktop blankbottom">
        <div className="titlearea">
          <h2>관심상품</h2>
        </div>

        {loading ? (
          <p className="nodata">로딩 중...</p>
        ) : wishlist.length === 0 ? (
          <div className="cart-empty">
            <p>관심상품이 없습니다.</p>
            <button className="btnsubmit sizem" onClick={() => navigate("/shop")}>
              상품 보러가기
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.wid} className="wishlist-card">
                <div className="wishlist-img" onClick={() => navigate(`/detail/${item.pid}`)}>
                  <img src={item.imgurl} alt={item.title} />
                  {/* 찜 취소 버튼 */}
                  <button
                    className="wish-remove-btn"
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.pid); }}
                    title="관심상품 취소"
                  >
                    ♥
                  </button>
                </div>
                <div className="wishlist-info">
                  <strong onClick={() => navigate(`/detail/${item.pid}`)}>
                    {item.title}
                  </strong>
                  <p>{formatPrice(item.price)}원</p>
                  <span className="wishlist-category">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
