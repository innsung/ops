import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";
import { axiosPost } from "../utils/dataFetch";
import { Link } from "react-router-dom";
import { SHOP_MENUS, COMMUNITY_MENUS } from "../data/header.js";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sswitch, setSswitch] = useState(false);

  const { isLoggedIn, userId, wishCount, cartCount, role } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axiosPost("/auth/logout");
    } catch (err) {
      console.error("로그아웃 오류:", err);
    }
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="header relative">
      <div className="headerwrap fixed">
        <div className="container flex flexvcenter">

          {/* ── 왼쪽 네비 ── */}
          <nav>
            <ul className="flex">
              {/* ✅ 관리자 메뉴 */}
              {isLoggedIn && role === "admin" && (
                <li className="categoryitem">
                  <a className="categorylink" onClick={() => navigate("/admin")}
                    style={{ color: "#b17a52", fontWeight: "bold" }}>
                    관리자
                  </a>
                </li>
              )}
              <li className="categoryitem">
                <a className="categorylink" onClick={() => navigate("/About")}>ABOUT US</a>
              </li>
              <li className="categoryitem">
                <a className="categorylink" onClick={() => navigate("/shop")}>SHOP</a>
                <div className="subcategory">
                  <ul className="subcategorylist">
                    {SHOP_MENUS.map(({ label, path }) => (
                      <li key={label} className="subcategoryitem">
                        <a className="subcategorylink" onClick={() => navigate(path)}>{label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="categoryitem">
                <a className="categorylink" onClick={() => navigate("/community/notice")}>COMMUNITY</a>
                <div className="subcategory">
                  <ul className="subcategorylist">
                    {COMMUNITY_MENUS.map(({ label, path, internal, external }) => (
                      <li key={label} className="subcategoryitem">
                        {external ? (
                          <a className="subcategorylink" href={path} target="_blank" rel="noopener noreferrer">{label}</a>
                        ) : internal ? (
                          <a className="subcategorylink" onClick={() => navigate(path)}>{label}</a>
                        ) : (
                          <a className="subcategorylink" onClick={() => alert("준비중입니다.")}>{label}</a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="categoryitem">
                <a className="categorylink" onClick={() => navigate("/Member")}>MEMBERSHIP</a>
              </li>
            </ul>
          </nav>

          {/* ── 로고 ── */}
          <div className="toplogo">
            <a className="toplogolink flex flexvcenter flexhcenter" onClick={() => navigate("/")}>
              <img src="/img/logo.png" alt="OPS Logo" />
            </a>
          </div>

          {/* ── 오른쪽 유저 메뉴 ── */}
          <div className="rightmenu flex flexvcenter">
            {isLoggedIn ? (
              <div>
                <span className="usermenulink">{userId}</span>
                <span className="slash"> | </span>
                <a className="usermenulink" onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Logout
                </a>
              </div>
            ) : (
              <div>
                <a className="usermenulink" onClick={() => navigate("/Login")} style={{ cursor: "pointer" }}>Login </a>
                <span className="slash">/ </span>
                <a className="usermenulink" onClick={() => navigate("/Join")} style={{ cursor: "pointer" }}> Join</a>
              </div>
            )}

            <div className="iconmenu flex flexvcenter">
              <a className="iconmenuitem" onClick={() => setSswitch(true)}>
                <img src="/img/search.png" style={{ width: "18px", height: "18px" }} alt="search" />
              </a>
              <a className="iconmenuitem" style={{ position: "relative" }}
                onClick={() => isLoggedIn ? navigate("/wishlist") : navigate("/Login")}>
                <img src="/img/heart.png" style={{ width: "18px", height: "18px" }} alt="wishlist" />
                {isLoggedIn && wishCount > 0 && (
                  <span className="icon-badge">{wishCount}</span>
                )}
              </a>
              <a className="iconmenuitem" style={{ position: "relative" }}
                onClick={() => navigate("/cart")}>
                <img src="/img/cart.png" style={{ width: "20px", height: "20px" }} alt="cart" />
                {isLoggedIn && cartCount > 0 && (
                  <span className="icon-badge">{cartCount}</span>
                )}
              </a>
            </div>
          </div>
        </div>

        {/* ── 검색창 ── */}
        <div className={"search " + (sswitch ? "on" : "")}>
          <div className="container">
            <div className="searchform relative flex flexvcenter">
              <fieldset className="searchfield">
                <input id="keyword" name="keyword" type="text"
                  placeholder="무엇을 찾아드릴까요?" className="searchinput" />
              </fieldset>
              <span className="searchclose" onClick={() => setSswitch(false)}>
                <img src="/img/close.png" alt="close" />
              </span>
            </div>
          </div>
        </div>
        <div className={"searchbg " + (sswitch ? "on" : "")} onClick={() => setSswitch(false)} />
      </div>
    </header>
  );
}
