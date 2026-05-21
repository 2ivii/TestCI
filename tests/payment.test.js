const { processPayment } = require('../src/payment');
const { createTestOrder } = require('./fixtures/orderFixtures');

describe('processPayment', () => {
  describe('카드 결제', () => {
    it('CARD 결제가 성공하면 PAID 상태의 결제 정보를 반환한다', async () => {
      // Arrange
      const order = createTestOrder({ finalPrice: 22000 });

      // Act
      const result = await processPayment(order, 'CARD');

      // Assert
      expect(result.paymentId).toBeDefined();
      expect(result.orderId).toBe(order.orderId);
      expect(result.method).toBe('CARD');
      expect(result.amount).toBe(22000);
      expect(result.status).toBe('PAID');
      expect(result.paidAt).toBeDefined();
    });
  });

  describe('현금 결제', () => {
    it('CASH 결제가 성공하면 PAID 상태의 결제 정보를 반환한다', async () => {
      // Arrange
      const order = createTestOrder({ finalPrice: 15000 });

      // Act
      const result = await processPayment(order, 'CASH');

      // Assert
      expect(result.method).toBe('CASH');
      expect(result.amount).toBe(15000);
      expect(result.status).toBe('PAID');
    });
  });

  describe('포인트 결제', () => {
    it('잔액이 충분하면 POINT 결제에 성공한다', async () => {
      // Arrange
      const order = createTestOrder({ userId: 'user-001', finalPrice: 20000 });
      const getPointBalance = jest.fn().mockResolvedValue(30000); // 잔액 30,000 > 결제금액 20,000

      // Act
      const result = await processPayment(order, 'POINT', getPointBalance);

      // Assert
      expect(result.method).toBe('POINT');
      expect(result.amount).toBe(20000);
      expect(result.status).toBe('PAID');
    });

    it('POINT 결제 시 getPointBalance를 정확히 1번 호출한다', async () => {
      // Arrange
      const order = createTestOrder({ userId: 'user-001', finalPrice: 20000 });
      const getPointBalance = jest.fn().mockResolvedValue(50000);

      // Act
      await processPayment(order, 'POINT', getPointBalance);

      // Assert — Mock의 CCTV: 호출 횟수 검증
      expect(getPointBalance).toHaveBeenCalledTimes(1);
    });

    it('POINT 결제 시 getPointBalance에 userId를 전달한다', async () => {
      // Arrange
      const order = createTestOrder({ userId: 'user-001', finalPrice: 20000 });
      const getPointBalance = jest.fn().mockResolvedValue(50000);

      // Act
      await processPayment(order, 'POINT', getPointBalance);

      // Assert — Mock의 CCTV: 전달된 인자 검증
      expect(getPointBalance).toHaveBeenCalledWith('user-001');
    });

    it('잔액이 부족하면 POINT 결제가 실패한다', async () => {
      // Arrange
      const order = createTestOrder({ userId: 'user-001', finalPrice: 20000 });
      const getPointBalance = jest.fn().mockResolvedValue(10000); // 잔액 10,000 < 결제금액 20,000

      // Act & Assert
      await expect(processPayment(order, 'POINT', getPointBalance)).rejects.toThrow();
    });

    it('잔액 부족 시에도 getPointBalance는 정확히 1번 호출된다', async () => {
      // Arrange
      const order = createTestOrder({ userId: 'user-001', finalPrice: 20000 });
      const getPointBalance = jest.fn().mockResolvedValue(5000);

      // Act
      await processPayment(order, 'POINT', getPointBalance).catch(() => {});

      // Assert — Mock의 CCTV: 에러 경로에서도 호출 추적
      expect(getPointBalance).toHaveBeenCalledTimes(1);
      expect(getPointBalance).toHaveBeenCalledWith('user-001');
    });
  });

  describe('에러 처리', () => {
    it('유효하지 않은 결제 수단이면 에러가 발생한다', async () => {
      // Arrange
      const order = createTestOrder();

      // Act & Assert
      await expect(processPayment(order, 'BITCOIN')).rejects.toThrow();
    });

    it('order가 없으면 에러가 발생한다', async () => {
      // Act & Assert
      await expect(processPayment(null, 'CARD')).rejects.toThrow();
    });

    it('order에 finalPrice가 없으면 에러가 발생한다', async () => {
      // Arrange
      const order = createTestOrder({ finalPrice: undefined });

      // Act & Assert
      await expect(processPayment(order, 'CARD')).rejects.toThrow();
    });
  });
});
