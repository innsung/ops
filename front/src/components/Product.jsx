import { useNavigate } from "react-router-dom";

function priceChange(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 홈 화면 베스트셀러 / 신상품 카드 */
export default function Product({ product }) {
  const navigate = useNavigate();

  return (
    <li
      className="slideprditem swiperslide1"
      onClick={() => navigate("/detail/" + product.id)}
      style={{ cursor: "pointer" }}
    >
      <div className="thumbnail">
        <a>
          <img src={product.imgurl} alt={product.title} />
        </a>
        <div className="iconbox">
          <span className="cart">
            <img src="/img/iconcart.svg" alt="cart" />
          </span>
        </div>
      </div>
      <div className="description">
        <a>
          <strong className="name">
            <span style={{ fontSize: "13px", color: "#555555", fontWeight: "bold" }}>
              {product.title}
            </span>
          </strong>
          <ul className="spec">
            <li className="productprice">
              <span style={{ fontSize: "13px", color: "#555555" }}>
                ₩{priceChange(product.price)}
              </span>
            </li>
          </ul>
          <div className="icon">
            {product.icon && <img src={product.icon} alt="badge" />}
          </div>
        </a>
      </div>
    </li>
  );
}
