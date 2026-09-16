import { useState, useEffect } from "react";
import { MAGAZINE_LIST } from "../data/magazine.js"

export default function Magazine() {
  const [loaded, setLoaded] = useState({});
  const [hovered, setHovered] = useState(null);

  const handleLoad = (id) => {
    setLoaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="magazine-page">
      {/* ── 헤더 타이틀 영역 ── */}
      <div className="magazine-hero">
        <p className="magazine-sub">Saison de OPS</p>
        <h1 className="magazine-title">MAGAZINE</h1>
        <p className="magazine-desc">
          OPS의 계절과 이야기를 담은 매거진입니다.
        </p>
      </div>

      {/* ── 갤러리 그리드 ── */}
      <div className="magazine-grid">
        {MAGAZINE_LIST.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`magazine-card ${hovered === item.id ? "hovered" : ""}`}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="magazine-img-wrap">
              {!loaded[item.id] && <div className="magazine-skeleton" />}
              <img
                src={item.img}
                alt={item.title}
                className={`magazine-img ${loaded[item.id] ? "visible" : ""}`}
                onLoad={() => handleLoad(item.id)}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="magazine-overlay">
                <span className="magazine-view-btn">VIEW →</span>
              </div>
            </div>
            <p className="magazine-card-title">{item.title}</p>
          </a>
        ))}
      </div>

      <style>{`
        .magazine-page {
          min-height: 100vh;
          padding-bottom: 80px;
          background: #faf9f7;
        }

        /* ── 히어로 ── */
        .magazine-hero {
          text-align: center;
          padding: 80px 20px 50px;
          border-bottom: 1px solid #e8e4de;
          margin-bottom: 50px;
        }
        .magazine-sub {
          font-size: 12px;
          letter-spacing: 4px;
          color: #b17a52;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .magazine-title {
          font-size: 42px;
          font-weight: 300;
          letter-spacing: 10px;
          color: #1a1a1a;
          margin: 0 0 16px;
        }
        .magazine-desc {
          font-size: 13px;
          color: #888;
          letter-spacing: 1px;
        }

        /* ── 그리드 ── */
        .magazine-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        @media (max-width: 1024px) {
          .magazine-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .magazine-grid { grid-template-columns: repeat(2, 1fr); padding: 0 20px; }
          .magazine-title { font-size: 28px; letter-spacing: 6px; }
        }
        @media (max-width: 480px) {
          .magazine-grid { grid-template-columns: repeat(1, 1fr); }
        }

        /* ── 카드 ── */
        .magazine-card {
          text-decoration: none;
          color: inherit;
          display: block;
          cursor: pointer;
        }

        .magazine-img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          background: #ede9e3;
        }

        /* 스켈레톤 */
        .magazine-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #ede9e3 25%, #e5e0d9 50%, #ede9e3 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* 이미지 */
        .magazine-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.4s ease, transform 0.5s ease;
        }
        .magazine-img.visible {
          opacity: 1;
        }
        .magazine-card:hover .magazine-img {
          transform: scale(1.05);
        }

        /* 오버레이 */
        .magazine-overlay {
          position: absolute;
          inset: 0;
          background: rgba(26, 26, 26, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .magazine-card:hover .magazine-overlay {
          opacity: 1;
        }

        .magazine-view-btn {
          color: #fff;
          font-size: 12px;
          letter-spacing: 4px;
          border: 1px solid rgba(255,255,255,0.7);
          padding: 10px 20px;
        }

        /* 카드 타이틀 */
        .magazine-card-title {
          margin: 10px 0 0;
          font-size: 12px;
          letter-spacing: 1.5px;
          color: #555;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
