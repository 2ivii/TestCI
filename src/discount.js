const DISCOUNT_RATES = {
  NORMAL: 0,
  SILVER: 0.05,
  GOLD: 0.10,
  VIP: 0.15,
};

const MAX_DISCOUNT = 10000;

function calculateDiscount(price, userGrade) {
  if (typeof price !== 'number' || isNaN(price)) {
    throw new Error('price must be a number');
  }
  if (price < 0) {
    throw new Error('price must be 0 or greater');
  }
  if (!(userGrade in DISCOUNT_RATES)) {
    throw new Error(`invalid userGrade: ${userGrade}`);
  }

  const discount = price * DISCOUNT_RATES[userGrade];
  return Math.min(discount, MAX_DISCOUNT);
}

module.exports = { calculateDiscount };
