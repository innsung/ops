/** 홈 화면 인스타그램 피드 아이템 */
export default function Instacon({ insta, i }) {
  return (
    <li className="medialistitem noborder" style={{ width: "25%" }}>
      <div className="mediaimagewrapper" style={{ margin: "0 0 5px 5px" }}>
        <div className="thumbnailwrapper">
          <a className="thumbnail hovercaption">
            <figure className="thumbnailimage">
              <img
                src={`/img/insta${i}.png`}
                alt={`insta${i}`}
                className="objectfit"
              />
              <div className="captionoverlay">
                <div className="captiondetails">
                  <div className="longcaption">{insta.content}</div>
                </div>
              </div>
            </figure>
          </a>
        </div>
      </div>
    </li>
  );
}
