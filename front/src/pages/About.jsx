import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function About() {
  const [fade, setFade] = useState("");
  useEffect(() => {
    setFade("end");
    return () => setFade("");
  }, []);

  return (
    <>
      <div id="container" className={"start " + fade}>
        <div id="contents" className="blanktop blankbottom">
          <div className="titlearea">
            <h2>About OPS</h2>
          </div>
          <div className="mallcenter">
            <div className="img">
              <img src="/img/company.jpg" style={{ marginTop: "100px" }} alt="company" />
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
