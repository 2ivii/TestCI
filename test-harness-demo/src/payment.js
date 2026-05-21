const { randomUUID } = require('crypto');

const VALID_METHODS = ['CARD', 'CASH', 'POINT'];

async function processPayment(order, paymentMethod, getPointBalance) {
  if (!order || order.finalPrice == null) {
    throw new Error('invalid order');
  }
  if (!VALID_METHODS.includes(paymentMethod)) {
    throw new Error(`invalid paymentMethod: ${paymentMethod}`);
  }

  if (paymentMethod === 'POINT') {
    const balance = await getPointBalance(order.userId);
    if (balance < order.finalPrice) {
      throw new Error('insufficient point balance');
    }
  }

  return {
    paymentId: randomUUID(),
    orderId: order.orderId,
    method: paymentMethod,
    amount: order.finalPrice,
    status: 'PAID',
    paidAt: new Date().toISOString(),
  };
}

module.exports = { processPayment };
