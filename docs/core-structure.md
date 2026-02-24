# Core Structure

The skeleton that does not bend. Less is the discipline, not the shortcut.

---

## Rule zero

Nothing exists without a failing test.
No file. No function. No line.

---

## The layers

```
e2e test          ← acceptance boundary
  page            ← route entry point
    component     ← pure renderer
      use case    ← business logic
        repository  ← persistence interface
```

Outside-in always. Each layer is driven by the failing test of the layer above it.
The acceptance test stays RED until the innermost layer connects.

---

## Page contract

```typescript
export default async function Page({ getX }: { getX?: () => Promise<X> } = {}) {
  const x = getX ? await getX() : defaultValue;
  return <Component x={x} />;
}
```

Injectable. No logic. No business conditionals.
`getX` is the seam: production wires the real repository; tests pass a stub.

---

## Component contract

Props in. JSX out.
No async. No side effects. No imports from use cases or repositories.

---

## Domain

```
Product { id, name, description, price }
  └── OrderItem { productId, quantity, price }   ← price frozen at order time
        └── Order { id, status, total }
```

A product can change. A placed order cannot.

---

## Commit contract

| prefix           | written when                          |
|------------------|---------------------------------------|
| `acceptance red` | E2E test added, failing               |
| `red`            | Unit test added, failing              |
| `green`          | Simplest code that makes the test pass |
| `refactor`       | Structure changed, behavior unchanged |

One TDD state transition per commit. Never combined.
Three similar lines of code are better than a premature abstraction.
