import { useState } from "react";

const SHOP_LINKS  = ["Notice", "My page", "Q&A", "FAQ"];
const FOLLOW_LINKS = ["Instagram", "Youtube", "Smartstore", "Facebook"];

export default function Footer() {
  const [listshow, setListshow] = useState(false);

  return (
    <footer className="footer">
      <div className="footerinner">
        <div className="container containerfooter clearfix">

          {/* ── 왼쪽 ── */}
          <div className="footerleft pullleft">
            <div className="footerlogo">
              <a><img src="/img/logo.png" alt="OPS Logo" /></a>
            </div>
            <p className="footertxt">Copyright © OPS(옵스) .All rights reserved.</p>
            <div
              className="policy relative"
              onMouseEnter={() => setListshow(true)}
              onMouseLeave={() => setListshow(false)}
            >
              <a className="policyabout">About</a>
              <ul className={"policylist " + (listshow ? "on" : "")}>
                <li className="policyitem"><a className="policylink" onClick={() => alert("준비중입니다.")} style={{ cursor: "pointer" }}>Privacy policy</a></li>
                <li className="policyitem"><a className="policylink" onClick={() => alert("준비중입니다.")} style={{ cursor: "pointer" }}>Agreement</a></li>
                <li className="policyitem"><a className="policylink" onClick={() => alert("준비중입니다.")} style={{ cursor: "pointer" }}>Guide</a></li>
              </ul>
            </div>
          </div>

          {/* ── 오른쪽 ── */}
          <div className="footerright pullright clearfix">
            <div className="footercolumn pullleft">
              <div className="footertitle">Customer center</div>
              <p className="footertxt">1588. 3069</p>
              <p className="footertxt">AM 09:30 - PM 05:30</p>
            </div>
            <div className="footercolumn pullleft">
              <div className="footertitle">Company info</div>
              <p className="footertxt">상호명 : 옵스(OPS)</p>
              <p className="footertxt">대표 : 김상용</p>
              <p className="footertxt">주소 : 부산광역시 남구 신선로 201 (감만동) 1동</p>
              <p className="footertxt">사업자 등록번호 : 617-81-25278</p>
              <p className="footertxt">통신판매신고번호 : 제 2014-부산남구-6호</p>
              <p className="footertxt">이메일 : MALL@OPS.CO.KR</p>
            </div>
            <div className="footercolumn pullleft">
              <div className="footertitle">Shop menu</div>
              <ul className="footernav">
                {SHOP_LINKS.map((item) => (
                  <li key={item}><a className="footerlink footertxt" onClick={() => alert("준비중입니다.")} style={{ cursor: "pointer" }}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div className="footercolumn pullleft">
              <div className="footertitle">Follow us</div>
              <ul className="footernav">
                {FOLLOW_LINKS.map((item) => (
                  <li key={item}><a className="footerlink footertxt" onClick={() => alert("준비중입니다.")} style={{ cursor: "pointer" }}>{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
