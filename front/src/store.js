import { configureStore, createSlice } from "@reduxjs/toolkit";

let user = createSlice({
  name: "user",
  initialState: {
    uid:          null,
    userId:       "",
    accessToken:  "",
    isLoggedIn:   false,
    authChecked:  false,
    role:         "",      // ✅ role 추가
    wishCount:    0,
    cartCount:    0,
  },
  reducers: {
    setUser(state, action) {
      state.uid         = action.payload.uid;
      state.userId      = action.payload.userId;
      state.accessToken = action.payload.accessToken;
      state.role        = action.payload.role || "";  // ✅ role 저장
      state.isLoggedIn  = true;
      state.authChecked = true;
      state.cartCount   = 0;
    },
    setWishCount(state, action) {
      state.wishCount = action.payload;
    },
    setCartCount(state, action) {
      state.cartCount = action.payload;
    },
    logout(state) {
      state.uid         = null;
      state.userId      = "";
      state.accessToken = "";
      state.role        = "";  // ✅ role 초기화
      state.isLoggedIn  = false;
      state.authChecked = true;
      state.wishCount   = 0;
      state.cartCount   = 0;
    },
  },
});

export let { setUser, logout, setWishCount, setCartCount } = user.actions;

let cart = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addCount(state, action) {
      const item = state.find((a) => a.id === action.payload);
      if (item) item.count++;
    },
    decreaseCount(state, action) {
      const item = state.find((a) => a.id === action.payload);
      if (!item) return;
      if (item.count > 1) item.count--;
      else alert("최소 주문수량은 1개 입니다.");
    },
    addItem(state, action) {
      const existing = state.find((a) => a.id === action.payload.id);
      if (existing) existing.count += action.payload.count;
      else state.push(action.payload);
    },
    deleteItem(state, action) {
      const idx = state.findIndex((a) => a.id === action.payload);
      if (idx !== -1) state.splice(idx, 1);
    },
    clearCart() { return []; },
    sortName(state) {
      state.sort((a, b) => (a.name > b.name ? 1 : -1));
    },
  },
});

export const { addCount, decreaseCount, addItem, deleteItem, clearCart, sortName } = cart.actions;

export default configureStore({
  reducer: {
    user: user.reducer,
    cart: cart.reducer,
  },
});
