# test-harness-demo

테스트 하네스 데모 — AI 생성 코드의 자동 검증 구조

배달 주문 서비스(할인 계산 · 주문 처리 · 결제)를 예제 도메인으로 삼아,
Jest 기반 테스트 하네스와 GitHub Actions CI가 AI가 생성한 코드를 어떻게 자동으로 검증하는지 보여주는 프로젝트입니다.

---

## 테스트 하네스 구성 요소

| 구성 요소 | 역할 | 이 프로젝트에서의 매핑 |
|-----------|------|----------------------|
| 테스트 프레임워크 | 테스트 실행 및 단언 | Jest |
| 스텁 / Mock | 외부 의존성 격리 | `jest.fn()` — `payment.test.js`의 `getPointBalance` |
| 테스트 데이터 | 재사용 가능한 입력값 공급 | `tests/fixtures/orderFixtures.js` |
| 실행 엔진 | 자동 트리거 및 실행 | GitHub Actions (push / PR to main) |
| 검증 게이트 | 품질 기준 미달 시 차단 | 커버리지 80% 미달 시 머지 차단 |

---

## 실행 방법

```bash
# 테스트 실행
npm test

# 커버리지 포함 실행 (80% 미달 시 실패)
npm run test:coverage

# 파일 변경 감지 후 자동 재실행
npm run test:watch
```

---

## 프로젝트 구조

```
test-harness-demo/
├── .github/
│   └── workflows/
│       └── test.yml          # CI 파이프라인 (push/PR 시 자동 실행)
├── src/
│   ├── discount.js           # 할인 계산 모듈 (등급별 할인율, 상한 10,000원)
│   ├── order.js              # 주문 처리 모듈 (총액 계산, 배달팁, 최소 주문)
│   └── payment.js            # 결제 처리 모듈 (CARD / CASH / POINT)
├── tests/
│   ├── fixtures/
│   │   └── orderFixtures.js  # 테스트 데이터 팩토리 (createTestItems, createTestOrder)
│   ├── discount.test.js      # 유닛 테스트 — 할인 계산
│   ├── order.test.js         # 유닛 테스트 — 주문 처리 (실제 discount 모듈 사용)
│   └── payment.test.js       # 통합 테스트 — 결제 처리 (getPointBalance Mock 활용)
└── package.json
```
