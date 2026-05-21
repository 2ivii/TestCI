const { calculateDiscount } = require('../src/discount');

describe('calculateDiscount', () => {
  describe('회원 등급별 할인율', () => {
    it('일반 회원은 할인이 없다', () => {
      // Arrange
      const price = 10000;
      const userGrade = 'NORMAL';

      // Act
      const discount = calculateDiscount(price, userGrade);

      // Assert
      expect(discount).toBe(0);
    });

    it('SILVER 회원은 5% 할인된다', () => {
      // Arrange
      const price = 10000;
      const userGrade = 'SILVER';

      // Act
      const discount = calculateDiscount(price, userGrade);

      // Assert
      expect(discount).toBe(500);
    });

    it('GOLD 회원은 10% 할인된다', () => {
      // Arrange
      const price = 10000;
      const userGrade = 'GOLD';

      // Act
      const discount = calculateDiscount(price, userGrade);

      // Assert
      expect(discount).toBe(1000);
    });

    it('VIP 회원은 15% 할인된다', () => {
      // Arrange
      const price = 10000;
      const userGrade = 'VIP';

      // Act
      const discount = calculateDiscount(price, userGrade);

      // Assert
      expect(discount).toBe(1500);
    });
  });

  describe('할인 상한', () => {
    it('VIP 회원이 100,000원 주문 시 할인은 10,000원으로 제한된다', () => {
      // Arrange
      const price = 100000; // 15% = 15,000원이지만 상한은 10,000원
      const userGrade = 'VIP';

      // Act
      const discount = calculateDiscount(price, userGrade);

      // Assert
      expect(discount).toBe(10000);
    });

    it('GOLD 회원이 110,000원 주문 시 할인은 10,000원으로 제한된다', () => {
      // Arrange
      const price = 110000; // 10% = 11,000원이지만 상한은 10,000원
      const userGrade = 'GOLD';

      // Act
      const discount = calculateDiscount(price, userGrade);

      // Assert
      expect(discount).toBe(10000);
    });

    it('SILVER 회원이 200,000원 주문 시 할인은 10,000원으로 제한된다', () => {
      // Arrange
      const price = 200000; // 5% = 10,000원으로 정확히 상한에 걸림
      const userGrade = 'SILVER';

      // Act
      const discount = calculateDiscount(price, userGrade);

      // Assert
      expect(discount).toBe(10000);
    });
  });

  describe('경계값', () => {
    it('price가 0이면 할인 금액은 0이다', () => {
      // Arrange
      const price = 0;
      const userGrade = 'VIP';

      // Act
      const discount = calculateDiscount(price, userGrade);

      // Assert
      expect(discount).toBe(0);
    });
  });

  describe('에러 처리', () => {
    it('price가 음수이면 에러가 발생한다', () => {
      // Arrange
      const price = -1000;
      const userGrade = 'NORMAL';

      // Act & Assert
      expect(() => calculateDiscount(price, userGrade)).toThrow();
    });

    it('price가 문자열이면 에러가 발생한다', () => {
      // Arrange
      const price = '10000';
      const userGrade = 'NORMAL';

      // Act & Assert
      expect(() => calculateDiscount(price, userGrade)).toThrow();
    });

    it('유효하지 않은 회원 등급이면 에러가 발생한다', () => {
      // Arrange
      const price = 10000;
      const userGrade = 'BRONZE';

      // Act & Assert
      expect(() => calculateDiscount(price, userGrade)).toThrow();
    });
  });
});
