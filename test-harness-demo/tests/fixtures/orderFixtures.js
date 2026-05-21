function createTestItems(overrides = []) {
  if (overrides.length > 0) return overrides;
  return [
    { name: '짜장면', price: 7000, quantity: 1 },
    { name: '탕수육', price: 15000, quantity: 1 },
  ];
}

function createTestOrder(overrides = {}) {
  const defaults = {
    orderId: 'test-order-id-123',
    userId: 'user-001',
    items: createTestItems(),
    totalPrice: 22000,
    discount: 0,
    deliveryFee: 0,
    finalPrice: 22000,
    status: 'CREATED',
    createdAt: '2024-01-01T00:00:00.000Z',
  };
  return { ...defaults, ...overrides };
}

module.exports = { createTestItems, createTestOrder };
