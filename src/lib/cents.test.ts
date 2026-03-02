import { toCents, fromCents } from "./cents";

describe("toCents", () => {
  test("converts dollars to cents", () => {
    expect(toCents(14.5)).toBe(1450);
  });

  test("converts zero dollars to zero cents", () => {
    expect(toCents(0)).toBe(0);
  });

  test("rounds to nearest cent to avoid floating point issues", () => {
    expect(toCents(19.99)).toBe(1999);
  });
});

describe("fromCents", () => {
  test("converts cents to dollars", () => {
    expect(fromCents(1450)).toBe(14.5);
  });

  test("converts zero cents to zero dollars", () => {
    expect(fromCents(0)).toBe(0);
  });

  test("converts cents that result in whole dollars", () => {
    expect(fromCents(1200)).toBe(12);
  });
});
