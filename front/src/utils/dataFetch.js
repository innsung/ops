import axios from "axios";
import store, { setUser, logout } from "../store";

/* ────────────────────────────────────────
   Axios 인스턴스 (Shoppy 패턴 적용)
   - baseURL: vite proxy가 /api → 서버로 중계
   - withCredentials: 쿠키(RefreshToken) 자동 첨부
──────────────────────────────────────── */
const instance = axios.create({
  baseURL:         "/api",
  withCredentials: true,   // 쿠키 자동 첨부
});

/* ────────────────────────────────────────
   Request 인터셉터
   — 모든 요청 헤더에 AccessToken 자동 삽입
──────────────────────────────────────── */
instance.interceptors.request.use((config) => {
  const token = store.getState().user.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ────────────────────────────────────────
   Response 인터셉터
   — 401 감지 → /auth/refresh → AccessToken 재발급 → 원래 요청 재시도
──────────────────────────────────────── */
instance.interceptors.response.use(
  (res) => {
    console.log(`✅ [${res.config.method.toUpperCase()}] ${res.config.url} →`, res.status);
    return res;
  },
  async (error) => {
    const { config, response } = error;

    console.warn(`❌ [${config?.method?.toUpperCase()}] ${config?.url} →`, response?.status);

    // 401 + 재시도 아님 + refresh 요청 자체가 아닐 때만 재발급 시도
    if (
      response?.status === 401 &&
      !config._retry &&
      !config.url.includes("/auth/refresh")
    ) {
      config._retry = true;

      try {
        const { data } = await instance.post("/auth/refresh");

        console.log("✅ 새 accessToken 발급 성공");

        // Redux store 업데이트
        store.dispatch(setUser({
          uid:         data.uid,
          userId:      data.userId,
          accessToken: data.accessToken,
        }));

        // 원래 요청 헤더에 새 토큰 적용 후 재시도
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        return instance(config);

      } catch (err) {
        console.error("❌ refreshToken 만료 → 강제 로그아웃");
        store.dispatch(logout());
        window.location.href = "/Login";
      }
    }

    return Promise.reject(error);
  }
);

/* ────────────────────────────────────────
   HTTP 메서드 헬퍼
──────────────────────────────────────── */
export const axiosGet = async (path) => {
  const res = await instance.get(path);
  return res.data;
};

export const axiosPost = async (path, data) => {
  const res = await instance.post(path, data);
  return res.data;
};

export const axiosPut = async (path, data) => {
  const res = await instance.put(path, data);
  return res.data;
};

export const axiosPatch = async (path, data) => {
  const res = await instance.patch(path, data);
  return res.data;
};

export const axiosDelete = async (path, data) => {
  const res = await instance.delete(path, { data });
  return res.data;
};

export default instance;
