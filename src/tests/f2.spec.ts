import { expect, test } from "vitest";
import F2 from "../kaitai/F2";

const mockBinaryFile = (n: number) => ({
  readU2le() {
    return n;
  },
});

const constructHalfFloat = (n: number) => new F2(mockBinaryFile(n)).floatValue;

/**
 * @see {@link https://stackoverflow.com/a/8796597}
 */
const decodeFloat16 = (binary: number) => {
  var exponent = (binary & 0x7c00) >> 10,
    fraction = binary & 0x03ff;
  return (
    (binary >> 15 ? -1 : 1) *
    (exponent
      ? exponent === 0x1f
        ? fraction
          ? NaN
          : Infinity
        : Math.pow(2, exponent - 15) * (1 + fraction / 0x400)
      : 6.103515625e-5 * (fraction / 0x400))
  );
};

test("fuzz conversion", () => {
  const RANGE = 0x7bff;
  const TRIALS = 88888;

  for (let i = 0; i < TRIALS; i++) {
    const n = Math.round(Math.random() * RANGE);
    const expected = decodeFloat16(n);
    const actual = constructHalfFloat(n);
    if (!Number.isFinite(expected)) {
      // this implementation doesn't handle infinity/NaN properly
      expect(actual).toEqual(0);
      continue;
    }
    expect(Math.abs(expected)).toBeCloseTo(actual);
  }
});

test("benchmark", () => {
  const RANGE = 0x7bff;
  const TRIALS = 88888;

  console.time("native js");
  for (let i = 0; i < TRIALS; i++) {
    const n = Math.round(Math.random() * RANGE);
    decodeFloat16(n);
  }
  console.timeEnd("native js");

  console.time("kaitai");
  for (let i = 0; i < TRIALS; i++) {
    const n = Math.round(Math.random() * RANGE);
    constructHalfFloat(n);
  }
  console.timeEnd("kaitai");
});
