import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FIELDS   = ["id", "pwd", "cpwd", "name", "phone", "email"];
const initForm = (keys) => keys.reduce((acc, k) => ({ ...acc, [k]: "" }), {});

export default function Join() {
  const navigate = useNavigate();
  const [step,   setStep]   = useState(1);
  const [form,   setForm]   = useState(initForm(FIELDS));
  const [errors, setErrors] = useState(initForm(FIELDS));
  const [agrees, setAgrees] = useState({ terms: false, privacy: false, marketing: false });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors(initForm(FIELDS));
  };

  const handleResetForm = () => {
    setForm(initForm(FIELDS));
    setErrors(initForm(FIELDS));
  };

  const handleIdCheck = () => {
    if (!form.id) {
      setErrors((p) => ({ ...p, id: "아이디를 입력해주세요" }));
      return;
    }
    alert(`"${form.id}" 사용 가능한 아이디입니다.`);
  };

  const handleAgreeAll = (e) => {
    const checked = e.target.checked;
    setAgrees({ terms: checked, privacy: checked, marketing: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id)              { setErrors((p) => ({ ...p, id:   "아이디를 입력해주세요" }));          return; }
    if (!form.pwd)             { setErrors((p) => ({ ...p, pwd:  "비밀번호를 입력해주세요" }));         return; }
    if (form.pwd !== form.cpwd){ setErrors((p) => ({ ...p, cpwd: "비밀번호가 일치하지 않습니다" }));    return; }
    if (!form.name)            { setErrors((p) => ({ ...p, name: "이름을 입력해주세요" }));             return; }
    if (!form.phone)           { setErrors((p) => ({ ...p, phone:"전화번호를 입력해주세요" }));          return; }

    try {
      const res  = await fetch("/api/auth/join", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          id:    form.id,
          pwd:   form.pwd,
          name:  form.name,
          phone: form.phone,
          email: form.email,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors((p) => ({ ...p, id: data.message || "회원가입에 실패했습니다." }));
        return;
      }

      setStep(3);
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div id="container">
      <div id="contents" className="blanktop blankbottom join-contents">
        <div className="titlearea">
          <h2>회원가입</h2>
        </div>

        {/* 단계 표시 */}
        <div className="join-step">
          <div className={step === 1 ? "active" : ""}>약관동의</div>
          <div className={step === 2 ? "active" : ""}>정보입력</div>
          <div className={step === 3 ? "active" : ""}>가입완료</div>
        </div>

        {/* ── Step 1 : 약관 동의 ── */}
        {step === 1 && (
          <div className="join-box">

            {/* 전체 동의 */}
            <h3>
              <label className="join-check" style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  className="hidden-check"
                  checked={agrees.terms && agrees.privacy && agrees.marketing}
                  onChange={handleAgreeAll}
                />
                <span className="check-mark" />
                전체 동의
              </label>
            </h3>

            <label className="join-check" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                className="hidden-check"
                checked={agrees.terms}
                onChange={(e) => setAgrees({ ...agrees, terms: e.target.checked })}
              />
              <span className="check-mark" />
              이용약관 동의 <span>(필수)</span>
            </label>
            <div className="join-terms">
              제1조 목적<br />
              이 약관은 OPS 온라인몰 서비스 이용과 관련하여 회사와 이용자의
              권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </div>

            <label className="join-check" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                className="hidden-check"
                checked={agrees.privacy}
                onChange={(e) => setAgrees({ ...agrees, privacy: e.target.checked })}
              />
              <span className="check-mark" />
              개인정보처리방침 동의 <span>(필수)</span>
            </label>
            <div className="join-terms">
              개인정보 수집 및 이용 목적<br />
              회원가입, 주문, 배송, 고객상담, 서비스 제공을 위해 개인정보를 수집합니다.
            </div>

            <label className="join-check" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                className="hidden-check"
                checked={agrees.marketing}
                onChange={(e) => setAgrees({ ...agrees, marketing: e.target.checked })}
              />
              <span className="check-mark" />
              쇼핑정보 수신 동의 <span>(선택)</span>
            </label>

            <div className="join-btns">
              <button
                onClick={() => {
                  if (!agrees.terms || !agrees.privacy) {
                    alert("필수 약관에 동의해주세요.");
                    return;
                  }
                  setStep(2);
                }}
                className="join-main-btn"
              >
                다음
              </button>
              <button onClick={() => navigate("/")} className="join-sub-btn">취소</button>
            </div>
          </div>
        )}

        {/* ── Step 2 : 정보 입력 ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="join-box">

              <div className="join-form-row">
                <label htmlFor="id">
                  아이디 *
                  {errors.id && <span className="login-error">{errors.id}</span>}
                </label>
                <div className="join-with-btn">
                  <input type="text" id="id" name="id" value={form.id}
                    onChange={handleChangeForm} placeholder="아이디 입력(6~20자)" />
                  <button type="button" onClick={handleIdCheck}>중복확인</button>
                </div>
              </div>

              <div className="join-form-row">
                <label htmlFor="pwd">
                  비밀번호 *
                  {errors.pwd && <span className="login-error">{errors.pwd}</span>}
                </label>
                <input type="password" id="pwd" name="pwd" value={form.pwd}
                  onChange={handleChangeForm} placeholder="비밀번호 입력" />
              </div>

              <div className="join-form-row">
                <label htmlFor="cpwd">
                  비밀번호 확인 *
                  {errors.cpwd && <span className="login-error">{errors.cpwd}</span>}
                </label>
                <input type="password" id="cpwd" name="cpwd" value={form.cpwd}
                  onChange={handleChangeForm} placeholder="비밀번호 재입력" />
              </div>

              <div className="join-form-row">
                <label htmlFor="name">
                  이름 *
                  {errors.name && <span className="login-error">{errors.name}</span>}
                </label>
                <input type="text" id="name" name="name" value={form.name}
                  onChange={handleChangeForm} placeholder="이름을 입력해주세요" />
              </div>

              <div className="join-form-row">
                <label htmlFor="phone">
                  전화번호 *
                  {errors.phone && <span className="login-error">{errors.phone}</span>}
                </label>
                <input type="text" id="phone" name="phone" value={form.phone}
                  onChange={handleChangeForm} placeholder="휴대폰 번호 입력 ('-' 포함)" />
              </div>

              <div className="join-form-row">
                <label htmlFor="email">이메일</label>
                <input type="email" id="email" name="email" value={form.email}
                  onChange={handleChangeForm} placeholder="이메일 입력" />
              </div>

              <div className="join-btns">
                <button type="submit" className="join-main-btn">회원가입</button>
                <button type="reset" className="join-sub-btn" onClick={handleResetForm}>다시쓰기</button>
              </div>
            </div>
          </form>
        )}

        {/* ── Step 3 : 가입 완료 ── */}
        {step === 3 && (
          <div className="join-box join-complete">
            <h3>회원가입이 완료되었습니다.</h3>
            <p>OPS 회원이 되신 것을 환영합니다.</p>
            <button onClick={() => navigate("/Login")} className="join-main-btn">
              로그인하기
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
