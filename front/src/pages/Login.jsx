import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setCartCount, setWishCount } from "../store";
import { axiosPost } from "../utils/dataFetch";

export default function Login() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const idRef     = useRef(null);
  const pwdRef    = useRef(null);

  const [formData, setFormData] = useState({ id: "", pwd: "" });
  const [errors,   setErrors]   = useState({ id: "", pwd: "" });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ id: "", pwd: "" });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id) {
      setErrors((p) => ({ ...p, id: "아이디를 입력해주세요" }));
      idRef.current.focus();
      return;
    }
    if (!formData.pwd) {
      setErrors((p) => ({ ...p, pwd: "비밀번호를 입력해주세요" }));
      pwdRef.current.focus();
      return;
    }

    try {
      const data = await axiosPost("/auth/login", {
        id:  formData.id,
        pwd: formData.pwd,
      });

      dispatch(setUser({
        uid:         data.uid,
        userId:      data.userId,
        accessToken: data.accessToken,
        role:        data.role,   // ✅ role 추가
      }));

      // ── 로그인 즉시 장바구니 + 관심상품 카운트 fetch
      try {
        const [cartRes, wishRes] = await Promise.all([
          fetch(`/api/cart/${data.uid}`),
          fetch(`/api/wishlist/${data.uid}`),
        ]);
        const [cartData, wishData] = await Promise.all([
          cartRes.json(),
          wishRes.json(),
        ]);
        dispatch(setCartCount(cartData.reduce((sum, item) => sum + item.count, 0)));
        dispatch(setWishCount(wishData.length));
      } catch {}

      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "로그인에 실패했습니다.";
      setErrors((p) => ({ ...p, pwd: msg }));
    }
  };

  return (
    <div id="container">
      <div id="contents" className="blanktop blankbottom">
        <div className="titlearea"><h2>Login</h2></div>

        <form onSubmit={handleLoginSubmit}>
          <div className="login">
            <fieldset className="form">

              <div className="id">
                <input ref={idRef} id="memberid" name="id"
                  value={formData.id} onChange={handleFormChange}
                  placeholder="아이디" type="text" />
              </div>
              {errors.id && <span className="login-error">{errors.id}</span>}

              <div className="password">
                <input ref={pwdRef} id="memberpasswd" name="pwd"
                  value={formData.pwd} onChange={handleFormChange}
                  placeholder="Password" type="password" />
              </div>
              {errors.pwd && <span className="login-error">{errors.pwd}</span>}

              <p className="loginsecurity">
                <input id="memberchecksaveid0" name="checksaveid" type="checkbox" value="T" />
                <label htmlFor="memberchecksaveid0">아이디 저장</label>
                <span className="secret">보안접속</span>
              </p>

              <div className="loginbutton">
                <button type="submit" className="btnsubmit gfull sizel">로그인</button>
              </div>

              <ul className="loginutill">
                <li><a>아이디 찾기</a></li>
                <li><a>비밀번호 찾기</a></li>
                <li>
                  <a onClick={() => navigate("/Join")} style={{ cursor: "pointer" }}>
                    회원가입
                  </a>
                </li>
              </ul>

            </fieldset>
          </div>
        </form>
      </div>
    </div>
  );
}
