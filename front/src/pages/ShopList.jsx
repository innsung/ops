import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { categoryMap, fallbackIds, CATEGORY_TABS } from "../data/shoplist.js";

export default function ShopList({ prdlist, category = "전체" }) {
  const meta = categoryMap[category] || categoryMap.전체;

  let products =
    category === "전체"
      ? prdlist
      : prdlist.filter((item) => item.category === category);

  // fallback: 카테고리 데이터 없는 경우 id로 직접 필터
  if (fallbackIds[category]) {
    products = fallbackIds[category]
      .map((id) => prdlist.find((item) => item.id === id))
      .filter(Boolean);
  }

  return (
    <div id="wrap">
      <div id="container">
        <main id="contents2">

          {/* breadcrumb */}
          <div className="path">
            <ol>
              <li><Link to="/">홈</Link></li>
              <li><span>SHOP</span></li>
              <li><span>{category}</span></li>
            </ol>
          </div>

          {/* 타이틀 */}
          <div className="titlearea shop-titlearea">
            <h2>{meta.title}</h2>
            <p>{meta.description}</p>
          </div>

          {/* ── 카테고리 탭 ── */}
          {/* Link 사용: a href → 풀 리로드 버그 수정 */}
          <div className="shop-category-tabs">
            {CATEGORY_TABS.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className={category === label ? "on" : ""}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* 상품 목록 */}
          <div className="shop-list-wrap">
            <ul className="shop-product-grid">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </ul>
          </div>

        </main>
      </div>
    </div>
  );
}
