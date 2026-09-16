import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosGet } from "../utils/dataFetch.js";
import { COMMUNITY_MENUS, STORE_LIST, FAQ_LIST, EVENT_LIST} from "../data/community.js";

const NOTICE_TAB = ["전체", "[이벤트]", "[매장]", "[배송]", "[공지]"]

export default function Community({ prdlist, category = "community" }) {
  
  const [noticeTab, setNoticeTab] = useState("전체")
  const [notice, setNotice] = useState([])
  const [event, setEvent] = useState([])
  const [loading, setLoading] = useState(false)
  const { isLoggedIn, userId, role } = useSelector((state) => state.user)

  // Q&A 더미데이터
  const [qnaList, setQnaList] = useState([
    { id: 1, user_id: "hong***", title: "빵 주문 후 교환이 가능한가요?", content: "빵을 주문했는데 다른 제품으로 교환이 가능한지 궁금합니다.", answer: "안녕하세요! 상품 수령 후 2일 이내에 고객센터(1588-3069)로 연락주시면 교환 도와드리겠습니다.", created_at: "2024-03-10" },
    { id: 2, user_id: "kim***", title: "선물 포장 서비스 있나요?", content: "선물용으로 구매하려고 하는데 포장 서비스가 있는지 궁금합니다.", answer: null, created_at: "2024-03-12" },
    { id: 3, user_id: "lee***", title: "배송 기간이 얼마나 걸리나요?", content: "주문 후 보통 며칠 내에 받을 수 있는지 알고 싶습니다.", answer: "평균 2~3 영업일 내에 배송됩니다. 주말/공휴일은 제외됩니다.", created_at: "2024-03-15" },
    { id: 4, user_id: "park***", title: "케이크 주문 시 문구 넣을 수 있나요?", content: "생일 케이크에 이름이나 문구를 넣을 수 있는지 문의드립니다.", answer: null, created_at: "2024-03-18" },
  ])
  const [qnaOpen, setQnaOpen] = useState(null)
  const [faqOpen, setFaqOpen] = useState(null)
  const [eventFilter, setEventFilter] = useState('전체')
  const [showForm, setShowForm] = useState(false)
  const [qnaTitle, setQnaTitle] = useState("")
  const [qnaContent, setQnaContent] = useState("")

  const filterNotice = notice.filter((item) => {
      if (noticeTab === "전체") return true
      return item.type === noticeTab
  })

  useEffect(() => {
    if (category === "notice") {
      setLoading(true)
      axiosGet('/community/notice')
        .then((data) => {
          // 💡 상단 고정 정렬 알고리즘 (ID 1~4번은 최상단 배치, 5번부터는 하단 배치)
          const fixedId = data.filter(item => item.id >= 1 && item.id <= 4);
          const notFixedId = data.filter(item => item.id >= 5);
          setNotice([...fixedId, ...notFixedId])
        })
        .catch((err) => {
          console.error("공지사항 로딩 실패:", err)
        })
        .finally(() => {
          setLoading(false)
        })
    }


  }, [category])

  const handleQnaSubmit = () => {
    if (!qnaTitle.trim() || !qnaContent.trim()) return alert("제목과 내용을 입력해주세요.")
    const newItem = {
      id: Date.now(),
      user_id: userId || "익명",
      title: qnaTitle,
      content: qnaContent,
      answer: null,
      created_at: new Date().toISOString().slice(0, 10)
    }
    setQnaList((prev) => [newItem, ...prev])
    setQnaTitle(""); setQnaContent(""); setShowForm(false)
  }

  return (
    <div id="wrap">
      <div id="container">
        <main id="contents2" className="blanktop">
          
          {/* 서브 서브네비게이션 탭 바 */}
          <div className="subcategory">
            <ul className="subcategorylist">
              {COMMUNITY_MENUS.map(({ label, path, catKey }) => {
                const isActive = category === catKey;

                return (
                  <li key={label} className="subcategoryitem">
                    <Link 
                      to={path} 
                      className={`subcategorylink ${isActive ? "on" : ""}`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="community-content-area" style={{ marginTop: "30px" }}>
            
            {category === "community" && (
              <div className="community-main-portal" style={{ marginTop: "20px" }}>
                <div 
                  className="community-grid-container" 
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
                    gap: "20px",
                    padding: "10px 0"
                  }}
                >
                  {COMMUNITY_MENUS.map(({ label, path }) => (
                    <Link key={label} to={path} className="community-portal-card">
                      <div className='community-portal-card-first'>
                        {label.charAt(0)}
                      </div>
                      <span style={{ fontSize: "15px", letterSpacing: "0.5px" }}>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {category === "notice" && (
              <div className='notice-board'>
                <div style={{ display: "flex", justifyContent: "center", textAlign: "center", fontSize: "22px", fontWeight: "bold", marginBottom: "20px", letterSpacing: "0.5px" }}>
                  NOTICE
                </div>

                <div className='notice-tab'>
                  {NOTICE_TAB.map((tab) => {
                    const isTab = noticeTab === tab;
                    return (
                      <button
                        key={tab}
                        className={`notice-filter-btn ${isTab ? "active" : ""}`}
                        onClick={() => setNoticeTab(tab)}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                <div className="notice-list">
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "30px", color: "#999" }}>로딩 중...</div>
                  ) : filterNotice.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px", color: "#999" }}>등록된 공지사항이 없습니다.</div>
                  ) : (
                    filterNotice.map((item) => {
                      const isPinned = item.id >= 1 && item.id <= 4;

                      return (
                        <div key={item.id} className={`notice-item ${isPinned ? "pinned-row" : ""}`}>
                          <h3>
                            {noticeTab === "전체" && (
                              <span style={{ color: isPinned ? "#000" : "#555", fontWeight: isPinned ? "bold" : "normal", marginRight: "8px" }}>
                                {item.type}
                              </span>
                            )}
                            {item.title}
                          </h3>
                          <div className="notice-meta">
                            <span>{item.writer}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {category === "magazine" && <div><h1>준비 중입니다</h1></div>}
            {category === "q&a" && (
              <div className="qna-board">
                <div className="qna-header">
                  <h2 className="qna-title-text">Q&amp;A</h2>
                  {isLoggedIn && (
                    <button className="qna-write-btn" onClick={() => setShowForm(!showForm)}>
                      {showForm ? "닫기" : "질문하기"}
                    </button>
                  )}
                </div>

                {/* 질문 작성 폼 */}
                {showForm && (
                  <div className="qna-form">
                    <input
                      className="qna-input"
                      placeholder="제목을 입력해주세요"
                      value={qnaTitle}
                      onChange={(e) => setQnaTitle(e.target.value)}
                    />
                    <textarea
                      className="qna-textarea"
                      placeholder="문의 내용을 입력해주세요"
                      value={qnaContent}
                      onChange={(e) => setQnaContent(e.target.value)}
                    />
                    <button className="qna-submit-btn" onClick={handleQnaSubmit}>등록</button>
                  </div>
                )}

                {/* Q&A 목록 */}
                {loading ? (
                  <div className="qna-empty">로딩 중...</div>
                ) : qnaList.length === 0 ? (
                  <div className="qna-empty">등록된 Q&amp;A가 없습니다.</div>
                ) : (
                  <div className="qna-list">
                    {qnaList.map((item) => (
                      <div key={item.id} className="qna-item">
                        {/* 질문 행 */}
                        <div className="qna-row" onClick={() => setQnaOpen(qnaOpen === item.id ? null : item.id)}>
                          <span className={`qna-badge ${item.answer ? "answered" : "waiting"}`}>
                            {item.answer ? "답변완료" : "답변대기"}
                          </span>
                          <span className="qna-item-title">{item.title}</span>
                          <span className="qna-item-user">{item.user_id}</span>
                          <span className="qna-arrow">{qnaOpen === item.id ? "▲" : "▼"}</span>
                        </div>

                        {/* 펼쳐진 내용 */}
                        {qnaOpen === item.id && (
                          <div className="qna-detail">
                            <div className="qna-question-box">
                              <span className="qna-q-label">Q</span>
                              <p>{item.content}</p>
                            </div>
                            {item.answer ? (
                              <div className="qna-answer-box">
                                <span className="qna-a-label">A</span>
                                <p>{item.answer}</p>
                              </div>
                            ) : (
                              role === "admin" && (
                                <div className="qna-no-answer">아직 답변이 등록되지 않았습니다.</div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <style>{`
                  .qna-board { max-width: 900px; margin: 0 auto; padding: 0 20px 60px; }
                  .qna-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                  .qna-title-text { font-size: 22px; font-weight: bold; letter-spacing: 0.5px; }
                  .qna-write-btn { background: #1a1a1a; color: #fff; border: none; padding: 8px 18px; font-size: 13px; cursor: pointer; letter-spacing: 1px; }
                  .qna-write-btn:hover { background: #b17a52; }

                  .qna-form { background: #faf9f7; border: 1px solid #e5e0d9; padding: 20px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 10px; }
                  .qna-input { border: 1px solid #ddd; padding: 10px 14px; font-size: 14px; outline: none; }
                  .qna-textarea { border: 1px solid #ddd; padding: 10px 14px; font-size: 14px; outline: none; min-height: 100px; resize: vertical; }
                  .qna-submit-btn { background: #b17a52; color: #fff; border: none; padding: 10px 20px; font-size: 13px; cursor: pointer; align-self: flex-end; }
                  .qna-submit-btn:hover { background: #8f5e38; }

                  .qna-empty { text-align: center; padding: 40px; color: #999; font-size: 14px; }

                  .qna-list { border-top: 2px solid #1a1a1a; }
                  .qna-item { border-bottom: 1px solid #e5e0d9; }
                  .qna-row { display: flex; align-items: center; gap: 12px; padding: 16px 10px; cursor: pointer; }
                  .qna-row:hover { background: #faf9f7; }
                  .qna-badge { font-size: 11px; padding: 3px 8px; border-radius: 2px; white-space: nowrap; font-weight: bold; }
                  .qna-badge.answered { background: #1a1a1a; color: #fff; }
                  .qna-badge.waiting  { background: #f0ebe4; color: #888; }
                  .qna-item-title { flex: 1; font-size: 14px; color: #222; }
                  .qna-item-user { font-size: 12px; color: #999; }
                  .qna-arrow { font-size: 11px; color: #aaa; }

                  .qna-detail { background: #faf9f7; padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
                  .qna-question-box, .qna-answer-box { display: flex; gap: 16px; align-items: flex-start; }
                  .qna-q-label { font-size: 18px; font-weight: bold; color: #b17a52; min-width: 24px; }
                  .qna-a-label { font-size: 18px; font-weight: bold; color: #1a1a1a; min-width: 24px; }
                  .qna-question-box p, .qna-answer-box p { font-size: 14px; color: #444; line-height: 1.7; margin: 0; }
                  .qna-admin-answer { display: flex; flex-direction: column; gap: 8px; }
                  .qna-no-answer { font-size: 13px; color: #aaa; padding: 10px 0; }
                `}</style>
              </div>
            )}
            {category === "guide" && (
              <div className="guide-board">
                <div className="guide-title-wrap">
                  <h2 className="guide-title">매장안내</h2>
                  <p className="guide-sub">전국 OPS 오프라인 매장을 안내해드립니다.</p>
                </div>
                <div className="guide-grid">
                  {STORE_LIST.map((store) => (
                    <div key={store.id} className="guide-card">
                      <div className="guide-img-wrap">
                        <img src={store.img} alt={store.name} className="guide-img"
                          onError={(e) => { e.target.style.display = "none" }} />
                      </div>
                      <div className="guide-info">
                        <h3 className="guide-name">{store.name}</h3>
                        <ul className="guide-detail">
                          <li><span className="guide-label">주소</span><span>{store.addr}</span></li>
                          <li><span className="guide-label">전화</span><span>{store.tel}</span></li>
                          <li><span className="guide-label">영업</span><span>{store.hours}</span></li>
                          <li><span className="guide-label">휴무</span><span>{store.holiday}</span></li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
                <style>{`
                  .guide-board { max-width: 1100px; margin: 0 auto; padding: 0 20px 60px; }
                  .guide-title-wrap { text-align: center; margin-bottom: 40px; }
                  .guide-title { font-size: 22px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 8px; }
                  .guide-sub { font-size: 13px; color: #999; }
                  .guide-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
                  @media (max-width: 768px) { .guide-grid { grid-template-columns: 1fr; } }
                  .guide-card { display: flex; gap: 20px; border-bottom: 1px solid #e5e0d9; padding-bottom: 24px; }
                  .guide-img-wrap { width: 140px; min-width: 140px; height: 110px; overflow: hidden; background: #f0ebe4; flex-shrink: 0; }
                  .guide-img { width: 100%; height: 100%; object-fit: cover; }
                  .guide-info { flex: 1; }
                  .guide-name { font-size: 15px; font-weight: bold; color: #1a1a1a; margin-bottom: 10px; letter-spacing: 0.3px; }
                  .guide-detail { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
                  .guide-detail li { display: flex; gap: 10px; font-size: 12px; color: #555; line-height: 1.5; }
                  .guide-label { color: #b17a52; font-weight: bold; min-width: 28px; flex-shrink: 0; }
                `}</style>
              </div>
            )}
            {category === "faq" && (
              <div className="faq-board">
                <div className="faq-title-wrap">
                  <h2 className="faq-title">FAQ</h2>
                  <p className="faq-sub">자주 묻는 질문을 확인해보세요.</p>
                </div>
                {FAQ_LIST.map((group) => (
                  <div key={group.category} className="faq-group">
                    <div className="faq-category-label">{group.category}</div>
                    {group.items.map((item, idx) => {
                      const key = `${group.category}-${idx}`
                      const isOpen = faqOpen === key
                      return (
                        <div key={key} className="faq-item">
                          <div className="faq-question" onClick={() => setFaqOpen(isOpen ? null : key)}>
                            <span className="faq-q-icon">Q</span>
                            <span className="faq-q-text">{item.q}</span>
                            <span className="faq-arrow">{isOpen ? "▲" : "▼"}</span>
                          </div>
                          {isOpen && (
                            <div className="faq-answer">
                              <span className="faq-a-icon">A</span>
                              <p>{item.a}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
                <style>{`
                  .faq-board { max-width: 900px; margin: 0 auto; padding: 0 20px 60px; }
                  .faq-title-wrap { text-align: center; margin-bottom: 40px; }
                  .faq-title { font-size: 22px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 8px; }
                  .faq-sub { font-size: 13px; color: #999; }
                  .faq-group { margin-bottom: 32px; }
                  .faq-category-label { font-size: 12px; font-weight: bold; letter-spacing: 2px; color: #b17a52; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px; margin-bottom: 0; }
                  .faq-item { border-bottom: 1px solid #e5e0d9; }
                  .faq-question { display: flex; align-items: center; gap: 12px; padding: 16px 10px; cursor: pointer; }
                  .faq-question:hover { background: #faf9f7; }
                  .faq-q-icon { font-size: 15px; font-weight: bold; color: #b17a52; min-width: 20px; }
                  .faq-q-text { flex: 1; font-size: 14px; color: #222; }
                  .faq-arrow { font-size: 11px; color: #aaa; }
                  .faq-answer { display: flex; gap: 12px; background: #faf9f7; padding: 16px 20px; align-items: flex-start; }
                  .faq-a-icon { font-size: 15px; font-weight: bold; color: #1a1a1a; min-width: 20px; }
                  .faq-answer p { font-size: 13px; color: #555; line-height: 1.8; margin: 0; }
                `}</style>
              </div>
            )}
            
            {category === "event" && (
              <div className="event-board">
                <div className="event-title-wrap">
                  <h2 className="event-title">EVENT</h2>
                  <p className="event-sub">OPS의 다양한 이벤트를 만나보세요.</p>
                </div>
                <div className="event-filter-wrap">
                  {["전체", "진행중", "종료"].map((f) => (
                    <button
                      key={f}
                      className={`event-filter-btn ${eventFilter === f ? "active" : ""}`}
                      onClick={() => setEventFilter(f)}
                    >{f}</button>
                  ))}
                </div>
                <div className="event-grid">
                  {EVENT_LIST.filter(e => eventFilter === "전체" || e.status === eventFilter).map((item) => (
                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="event-card">
                      <div className="event-img-wrap">
                        <img src={item.img} alt={item.title} className="event-img"
                          onError={(e) => { e.target.style.display = "none" }} />
                        <span className={`event-badge ${item.status === "진행중" ? "on" : "off"}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="event-info">
                        <p className="event-card-title">{item.title}</p>
                        <p className="event-card-date">{item.date}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <style>{`
                  .event-board { max-width: 1100px; margin: 0 auto; padding: 0 20px 60px; }
                  .event-title-wrap { text-align: center; margin-bottom: 30px; }
                  .event-title { font-size: 22px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 8px; }
                  .event-sub { font-size: 13px; color: #999; }
                  .event-filter-wrap { display: flex; gap: 8px; margin-bottom: 28px; justify-content: center; }
                  .event-filter-btn { border: 1px solid #ddd; background: #fff; padding: 6px 18px; font-size: 13px; cursor: pointer; color: #888; }
                  .event-filter-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
                  .event-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
                  @media (max-width: 768px) { .event-grid { grid-template-columns: repeat(2, 1fr); } }
                  .event-card { text-decoration: none; color: inherit; display: block; }
                  .event-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; background: #f0ebe4; }
                  .event-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
                  .event-card:hover .event-img { transform: scale(1.04); }
                  .event-badge { position: absolute; top: 10px; left: 10px; font-size: 11px; font-weight: bold; padding: 3px 8px; }
                  .event-badge.on  { background: #b17a52; color: #fff; }
                  .event-badge.off { background: rgba(0,0,0,0.45); color: #fff; }
                  .event-info { padding: 10px 2px 0; }
                  .event-card-title { font-size: 14px; color: #222; margin-bottom: 4px; font-weight: 500; }
                  .event-card-date  { font-size: 12px; color: #aaa; }
                `}</style>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}