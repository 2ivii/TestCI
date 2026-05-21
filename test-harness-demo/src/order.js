const { randomUUID } = require('crypto');
const { calculateDiscount } = require('./discount');

const MIN_ORDER_AMOUNT = 10000;
const FREE_DELIVERY_THRESHOLD = 15000;
const DELIVERY_FEE = 3000;

function createOrder(userId, items, userGrade) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('items must be a non-empty array');
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (totalPrice < MIN_ORDER_AMOUNT) {
    throw new Error(`minimum order amount is ${MIN_ORDER_AMOUNT}`);
  }

  const discount = calculateDiscount(totalPrice, userGrade);
  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const finalPrice = totalPrice - discount + deliveryFee;

  return {
    orderId: randomUUID(),
    userId,
    items,
    totalPrice,
    discount,
    deliveryFee,
    finalPrice,
    status: 'CREATED',
    createdAt: new Date().toISOString(),
  };
}

module.exports = { createOrder };
