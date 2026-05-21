const { createOrder } = require('../src/order');
const { createTestItems } = require('./fixtures/orderFixtures');

describe('createOrder', () => {
  describe('정상 주문 생성', () => {
    it('올바른 입력값으로 주문을 생성하면 필수 필드가 모두 반환된다', () => {
      // Arrange
      const userId = 'user-001';
      const items = createTestItems([{ name: '치킨', price: 18000, quantity: 1 }]);
      const userGrade = 'NORMAL';

      // Act
      const order = createOrder(userId, items, userGrade);

      // Assert
      expect(order.orderId).toBeDefined();
      expect(order.userId).toBe('user-001');
      expect(order.items).toEqual(items);
      expect(order.totalPrice).toBe(18000);
      expect(order.discount).toBe(0);
      expect(order.deliveryFee).toBe(0);
      expect(order.finalPrice).toBe(18000);
      expect(order.status).toBe('CREATED');
      expect(order.createdAt).toBeDefined();
    });

    it('orderId는 매 주문마다 고유하게 생성된다', () => {
      // Arrange
      const items = createTestItems([{ name: '피자', price: 20000, quantity: 1 }]);

      // Act
      const order1 = createOrder('user-001', items, 'NORMAL');
      const order2 = createOrder('user-002', items, 'NORMAL');

      // Assert
      expect(order1.orderId).not.toBe(order2.orderId);
    });
  });

  describe('할인 적용', () => {
    it('GOLD 회원은 총 금액의 10%가 할인된다', () => {
      // Arrange
      const items = createTestItems([{ name: '스테이크', price: 30000, quantity: 1 }]);
      // totalPrice = 30,000 → GOLD 10% → discount = 3,000

      // Act
      const order = createOrder('user-001', items, 'GOLD');

      // Assert
      expect(order.totalPrice).toBe(30000);
      expect(order.discount).toBe(3000);
      expect(order.finalPrice).toBe(27000);
    });

    it('VIP 회원이 100,000원 이상 주문 시 할인 상한 10,000원이 적용된다', () => {
      // Arrange
      const items = createTestItems([{ name: '명품도시락', price: 100000, quantity: 1 }]);
      // totalPrice = 100,000 → VIP 15% = 15,000 → 상한 10,000 적용

      // Act
      const order = createOrder('user-001', items, 'VIP');

      // Assert
      expect(order.discount).toBe(10000);
      expect(order.finalPrice).toBe(90000);
    });
  });

  describe('배달팁', () => {
    it('총 금액이 15,000원 이상이면 배달팁이 무료다', () => {
      // Arrange
      const items = createTestItems([{ name: '치킨', price: 15000, quantity: 1 }]);

      // Act
      const order = createOrder('user-001', items, 'NORMAL');

      // Assert
      expect(order.deliveryFee).toBe(0);
    });

    it('총 금액이 15,000원 미만이면 배달팁 3,000원이 부과된다', () => {
      // Arrange
      const items = createTestItems([{ name: '김밥', price: 12000, quantity: 1 }]);
      // totalPrice = 12,000 → deliveryFee = 3,000 → finalPrice = 15,000

      // Act
      const order = createOrder('user-001', items, 'NORMAL');

      // Assert
      expect(order.deliveryFee).toBe(3000);
      expect(order.finalPrice).toBe(15000);
    });

    it('수량이 여러 개인 경우 총 금액을 기준으로 배달팁을 계산한다', () => {
      // Arrange
      const items = createTestItems([{ name: '음료', price: 5000, quantity: 3 }]);
      // totalPrice = 5,000 × 3 = 15,000 → deliveryFee = 0

      // Act
      const order = createOrder('user-001', items, 'NORMAL');

      // Assert
      expect(order.totalPrice).toBe(15000);
      expect(order.deliveryFee).toBe(0);
    });
  });

  describe('에러 처리', () => {
    it('총 주문 금액이 10,000원 미만이면 에러가 발생한다', () => {
      // Arrange
      const items = createTestItems([{ name: '음료', price: 2000, quantity: 1 }]);

      // Act & Assert
      expect(() => createOrder('user-001', items, 'NORMAL')).toThrow();
    });

    it('빈 장바구니로 주문하면 에러가 발생한다', () => {
      // Arrange
      const items = [];

      // Act & Assert
      expect(() => createOrder('user-001', items, 'NORMAL')).toThrow();
    });
  });
});
