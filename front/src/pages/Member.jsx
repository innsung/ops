import { useState, useEffect } from "react";

export default function Member() {
  const [fade, setFade] = useState("");
  useEffect(() => {
    setFade("end");
    return () => setFade("");
  }, []);

  return (
    <div id="container" className={"start " + fade}>
      <div id="contents" className="blanktop blankbottom">
        <div className="titlearea">
          <h2>Membership</h2>
        </div>
        <div className="mallcenter">
          <div className="img">
            <img src="/img/membership.jpg" alt="membership" />
          </div>
        </div>
      </div>
    </div>
  );
}
