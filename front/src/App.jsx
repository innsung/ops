import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setUser, logout, setCartCount, setWishCount } from "./store";

import Header    from "./components/Header";
import Footer    from "./components/Footer";
import Home      from "./pages/Home";
import About     from "./pages/About";
import Member    from "./pages/Member";
import Login     from "./pages/Login";
import Join      from "./pages/Join";
import ShopList  from "./pages/ShopList";
import Detail    from "./pages/Detail";
import Cart      from "./pages/Cart";
import Wishlist  from "./pages/Wishlist";
import Order     from "./pages/Order";
import PayResult from "./pages/PayResult";
import Community from "./pages/Community";
import Admin     from "./pages/Admin";
import Magazine from "./pages/Magazine";

/* ── 로그인 필요 */
const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/Login" replace />;
};

/* ── 관리자 전용 */
const AdminRoute = ({ children }) => {
  const { isLoggedIn, role } = useSelector((state) => state.user);
  if (!isLoggedIn)      return <Navigate to="/Login" replace />;
  if (role !== "admin") return <Navigate to="/"      replace />;
  return children;
};

function App() {
  const dispatch    = useDispatch();
  const authChecked = useSelector((state) => state.user.authChecked);
  const [prdlist, setPrdlist] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── 앱 시작 시 RefreshToken으로 로그인 복구 */
  useEffect(() => {
    const restoreLogin = async () => {
      try {
        const res = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true, validateStatus: (s) => s < 500 }
        );

        if (res.status === 200) {
          dispatch(setUser({
            uid:         res.data.uid,
            userId:      res.data.userId,
            accessToken: res.data.accessToken,
            role:        res.data.role,   // ✅ role 복구
          }));

          try {
            const [cartRes, wishRes] = await Promise.all([
              fetch(`/api/cart/${res.data.uid}`),
              fetch(`/api/wishlist/${res.data.uid}`),
            ]);
            const [cartData, wishData] = await Promise.all([
              cartRes.json(),
              wishRes.json(),
            ]);
            dispatch(setCartCount(cartData.reduce((sum, item) => sum + item.count, 0)));
            dispatch(setWishCount(wishData.length));
          } catch (err) {
            console.error("카운트 복구 실패:", err);
          }

          console.log("✅ 로그인 복구 성공:", res.data.userId);
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      }
    };

    restoreLogin();
  }, [dispatch]);

  /* ── 상품 목록 fetch */
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => { setPrdlist(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!authChecked) return null;
  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/"               element={<Home prdlist={prdlist} />} />
        <Route path="/shop"           element={<ShopList prdlist={prdlist} category="전체" />} />
        <Route path="/shop/bread"     element={<ShopList prdlist={prdlist} category="빵" />} />
        <Route path="/shop/cookie"    element={<ShopList prdlist={prdlist} category="쿠키" />} />
        <Route path="/shop/chocolate" element={<ShopList prdlist={prdlist} category="초콜렛" />} />
        <Route path="/shop/gift"      element={<ShopList prdlist={prdlist} category="선물세트" />} />
        <Route path="/shop/cake"      element={<ShopList prdlist={prdlist} category="케이크" />} />
        <Route path="/community"              element={<Community prdlist={prdlist} category="community" />} />
        <Route path="/community/notice"       element={<Community prdlist={prdlist} category="notice" />} />
        <Route path="/community/magazine"     element={<Magazine />} />
        <Route path="/community/q&a"          element={<Community prdlist={prdlist} category="q&a" />} />
        <Route path="/community/guide"        element={<Community prdlist={prdlist} category="guide" />} />
        <Route path="/community/rvip"         element={<Community prdlist={prdlist} category="rvip" />} />
        <Route path="/community/faq"          element={<Community prdlist={prdlist} category="faq" />} />
        <Route path="/community/event"        element={<Community prdlist={prdlist} category="event" />} />
        <Route path="/detail/:id"     element={<Detail prdlist={prdlist} />} />
        <Route path="/cart"      element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/wishlist"  element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/order"     element={<PrivateRoute><Order /></PrivateRoute>} />
        <Route path="/payresult" element={<PayResult />} />
        <Route path="/About"     element={<About />} />
        <Route path="/Member"    element={<Member />} />
        <Route path="/Login"     element={<Login />} />
        <Route path="/Join"      element={<Join />} />
        <Route path="/admin"     element={<AdminRoute><Admin /></AdminRoute>} />  {/* ✅ 관리자 전용 */}

      </Routes>
      <Footer />
      <div
        className="scrollbtn relative flex flexvcenter flexhcenter on"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img src="/img/up.png" alt="top" />
      </div>
    </div>
  );
}

export default App;
