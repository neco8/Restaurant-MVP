# Core Structure

Less is the discipline, not the shortcut.

---

## Layers

```
page            ← route entry point
  component     ← pure renderer
    use case    ← business logic
      repository  ← persistence interface
```

Each layer depends only on the layer immediately below it. No skipping.

---

## Page contract

```typescript
export default async function Page({ getX }: { getX?: () => Promise<X> } = {}) {
  const x = getX ? await getX() : defaultValue;
  return <Component x={x} />;
}
```

No logic. No business conditionals.
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
