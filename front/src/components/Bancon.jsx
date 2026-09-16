import { useNavigate } from "react-router-dom";

/** 홈 화면 서브배너 3개 아이템 */
export default function Bancon({ banner, i }) {
  const navigate = useNavigate();

  // i 값에(i가 3이면 Member으로 이동) 따라 클릭 시 이동할 경로를 다르게 설정(2026-05-26 insung 추가)
  if(i === 3){
    return (
      <div
        className="subbanneritem relative"
        onClick={() => navigate("/Member")}
        style={{ cursor: "pointer" }}
      >
        <a>
          <img src={`/img/banner${i}.jpg`} alt={banner.title} />
          <div className="subbannertxt">
            <div className="subbannertitle">{banner.title}</div>
            <div className="subbannerdesc">{banner.content}</div>
          </div>
        </a>
      </div>
    );
  } else {
    return (
      <div
        className="subbanneritem relative"
        onClick={() => navigate("/shop/cake")}
        style={{ cursor: "pointer" }}
      >
        <a>
          <img src={`/img/banner${i}.jpg`} alt={banner.title} />
          <div className="subbannertxt">
            <div className="subbannertitle">{banner.title}</div>
            <div className="subbannerdesc">{banner.content}</div>
          </div>
        </a>
      </div>
    );
  }
}
