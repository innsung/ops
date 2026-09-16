import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatPrice } from "../utils/cart";

const TABS = ["회원 관리", "상품 관리", "주문 내역"];

const initProduct = {
  name: "", price: "", category: "", edate: "", smethod: "", imgurl: "", icon: "",
};

export default function Admin() {
  const navigate     = useNavigate();
  const accessToken  = useSelector((state) => state.user.accessToken);  // ✅ 토큰 가져오기

  const [tab,      setTab]      = useState(0);
  const [users,    setUsers]    = useState([]);
  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(false);

  const [form,    setForm]    = useState(initProduct);
  const [editPid, setEditPid] = useState(null);

  // ✅ 인증 헤더 포함한 fetch 헬퍼
  const authFetch = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

  useEffect(() => {
    if (tab === 0) fetchUsers();
    if (tab === 1) fetchProducts();
    if (tab === 2) fetchOrders();
  }, [tab]);

  const fetchUsers = async () => {
    setLoading(true);
    const res  = await authFetch("/api/admin/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const res  = await authFetch("/api/admin/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    const res  = await authFetch("/api/admin/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleDeleteUser = async (uid, name) => {
    if (!window.confirm(`"${name}" 회원을 삭제하시겠습니까?`)) return;
    await authFetch(`/api/admin/users/${uid}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = async () => {
    const method = editPid ? "PUT" : "POST";
    const url    = editPid ? `/api/admin/products/${editPid}` : "/api/admin/products";
    await authFetch(url, {
      method,
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setForm(initProduct);
    setEditPid(null);
    fetchProducts();
  };

  const handleEditProduct = (p) => {
    setForm({
      name: p.name, price: p.price, category: p.category,
      edate: p.edate, smethod: p.smethod, imgurl: p.imgurl, icon: p.icon,
    });
    setEditPid(p.pid);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (pid, name) => {
    if (!window.confirm(`"${name}" 상품을 삭제하시겠습니까?`)) return;
    await authFetch(`/api/admin/products/${pid}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div id="container">
      <div id="contents" className="blanktop blankbottom">
        <div className="titlearea">
          <h2>관리자 페이지</h2>
        </div>

        <div className="admin-tabs">
          {TABS.map((t, i) => (
            <button
              key={i}
              className={`admin-tab ${tab === i ? "active" : ""}`}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && <div className="loading">로딩 중...</div>}

        {/* ── 회원 관리 */}
        {tab === 0 && !loading && (
          <div className="admin-section">
            <h3 className="admin-section-title">회원 목록 ({users.length}명)</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>UID</th><th>아이디</th><th>이름</th><th>전화번호</th>
                  <th>이메일</th><th>권한</th><th>가입일</th><th>관리</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid}>
                    <td>{u.uid}</td>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.phone}</td>
                    <td>{u.email || "-"}</td>
                    <td>{u.role === "admin" ? "🔑 관리자" : "일반"}</td>
                    <td>{new Date(u.created_at).toLocaleDateString("ko-KR")}</td>
                    <td>
                      <button className="admin-btn-delete" onClick={() => handleDeleteUser(u.uid, u.name)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── 상품 관리 */}
        {tab === 1 && !loading && (
          <div className="admin-section">
            <h3 className="admin-section-title">{editPid ? "상품 수정" : "상품 등록"}</h3>
            <div className="admin-form">
              <div className="admin-form-grid">
                <input name="name"     value={form.name}     onChange={handleFormChange} placeholder="상품명" />
                <input name="price"    value={form.price}    onChange={handleFormChange} placeholder="가격" type="number" />
                <input name="category" value={form.category} onChange={handleFormChange} placeholder="카테고리 (빵/쿠키/초콜렛/선물세트/케이크)" />
                <input name="edate"    value={form.edate}    onChange={handleFormChange} placeholder="유통기한" />
                <input name="smethod"  value={form.smethod}  onChange={handleFormChange} placeholder="보관방법" />
                <input name="imgurl"   value={form.imgurl}   onChange={handleFormChange} placeholder="이미지 URL" />
                <input name="icon"     value={form.icon}     onChange={handleFormChange} placeholder="아이콘 URL" />
              </div>
              <div className="admin-form-btns">
                <button className="admin-btn-submit" onClick={handleProductSubmit}>
                  {editPid ? "수정 완료" : "등록"}
                </button>
                {editPid && (
                  <button className="admin-btn-cancel" onClick={() => { setForm(initProduct); setEditPid(null); }}>
                    취소
                  </button>
                )}
              </div>
            </div>

            <h3 className="admin-section-title" style={{ marginTop: "40px" }}>
              상품 목록 ({products.length}개)
            </h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>PID</th><th>상품명</th><th>가격</th><th>카테고리</th>
                  <th>유통기한</th><th>보관방법</th><th>관리</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.pid}>
                    <td>{p.pid}</td>
                    <td>{p.name}</td>
                    <td>₩{formatPrice(p.price)}</td>
                    <td>{p.category}</td>
                    <td>{p.edate}</td>
                    <td>{p.smethod}</td>
                    <td>
                      <button className="admin-btn-edit"   onClick={() => handleEditProduct(p)}>수정</button>
                      <button className="admin-btn-delete" onClick={() => handleDeleteProduct(p.pid, p.name)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── 주문 내역 */}
        {tab === 2 && !loading && (
          <div className="admin-section">
            <h3 className="admin-section-title">주문 내역 ({orders.length}건)</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>번호</th><th>아이디</th><th>이름</th><th>전화번호</th>
                  <th>상품명</th><th>단가</th><th>수량</th><th>합계</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.cid}>
                    <td>{o.cid}</td>
                    <td>{o.userId}</td>
                    <td>{o.userName}</td>
                    <td>{o.phone}</td>
                    <td>{o.productName}</td>
                    <td>₩{formatPrice(o.price)}</td>
                    <td>{o.count}</td>
                    <td>₩{formatPrice(o.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
