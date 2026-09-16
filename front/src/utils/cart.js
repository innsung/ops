/**
 * OPS 장바구니 유틸 함수
 * shoppy의 cart.js 패턴을 Redux 기반 OPS에 맞게 이식
 */

/**
 * 장바구니 추가 / 중복 시 수량 증가 (shoppy: cartItemsCheck)
 * @param {Array}  cartItems - 현재 Redux cart 상태
 * @param {Object} newItem   - { id, name, imgurl, ogprice, count }
 */
export function cartItemsCheck(cartItems, newItem) {
  const existing = cartItems.find((item) => item.id === newItem.id);
  if (existing) {
    // 이미 담긴 상품 → 수량만 증가
    return cartItems.map((item) =>
      item.id === newItem.id
        ? { ...item, count: item.count + newItem.count }
        : item
    );
  }
  // 새 상품 추가
  return [...cartItems, newItem];
}

/**
 * 수량 변경 (shoppy: updateCartItemsQty)
 * @param {Array}  cartItems
 * @param {number} id   - 상품 id
 * @param {string} type - '+' | '-'
 */
export function updateCartItemsQty(cartItems, id, type) {
  return cartItems.map((item) => {
    if (item.id !== id) return item;
    const next = type === "+" ? item.count + 1 : item.count - 1;
    return { ...item, count: next < 1 ? 1 : next };
  });
}

/**
 * 총 금액 계산 (shoppy: getTotalPrice)
 */
export function getTotalPrice(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.ogprice * item.count, 0);
}

/**
 * 배송비 계산 (3만원 이상 무료)
 */
export function getDeliveryFee(totalPrice) {
  if (totalPrice <= 0)      return 0;
  if (totalPrice >= 30000)  return 0;
  return 3000;
}

/**
 * 숫자 → 천단위 콤마
 */
export function formatPrice(number) {
  return Number(number).toLocaleString("ko-KR");
}
