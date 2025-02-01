import { expect, test } from "vitest";
import KaitaiFloat16 from "../kaitai/F2";

type BinaryFile = ReturnType<typeof mockBinaryFile>;
const mockBinaryFile = (n: number) => ({
  readU2le() {
    return n;
  },
});

class Float16 {
  public static readonly POSITIVE_INFINITY = 0x7c00;
  public static readonly NaN = 0x7c01;
  public static readonly NEGATIVE_INFINITY = 0xfc00;

  public static fromBinaryFile(file: BinaryFile) {
    return new KaitaiFloat16(file).floatValue;
  }

  /**
   * @see {@link https://stackoverflow.com/a/8796597}
   */
  public static fromBytes(bytes: number) {
    var exponent = (bytes & 0x7c00) >> 10,
      fraction = bytes & 0x03ff;
    return (
      (bytes >> 15 ? -1 : 1) *
      (exponent
        ? exponent === 0x1f
          ? fraction
            ? NaN
            : Infinity
          : Math.pow(2, exponent - 15) * (1 + fraction / 0x400)
        : 6.103515625e-5 * (fraction / 0x400))
    );
  }
}

const prettyHex = (n: number) => `0x${n.toString(16).padStart(4, "0")}`;
/**
 * from {@link https://stackoverflow.com/a/8796597}
 */
[
  0x3c00, // = 1
  0xc000, // = −2
  0x7bff, // = 6.5504 × 10^4 (max half precision)
  0x0400, // = 2^−14 ≈ 6.10352 × 10^−5 (minimum positive normal)
  0x0001, // = 2^−24 ≈ 5.96046 × 10^−8 (minimum strictly positive subnormal)
  0x0000, // = 0
  0x8000, // = −0
  0x3555, // ≈ 0.33325... ≈ 1/3
].forEach((n) => {
  test(prettyHex(n), () => {
    expect(Float16.fromBytes(n)).toBeCloseTo(
      Float16.fromBinaryFile(mockBinaryFile(n))
    );
  });
});

test("positive infinity", () => {
  expect(
    Float16.fromBinaryFile(mockBinaryFile(Float16.POSITIVE_INFINITY))
  ).toEqual(Number.POSITIVE_INFINITY);
});
test("negative infinity", () => {
  expect(
    Float16.fromBinaryFile(mockBinaryFile(Float16.NEGATIVE_INFINITY))
  ).toEqual(Number.NEGATIVE_INFINITY);
});
test("NaN", () => {
  expect(Float16.fromBinaryFile(mockBinaryFile(Float16.NaN))).toEqual(
    Number.NaN
  );
});

const getRandomInputs = (range: number, size: number) => {
  const numbers: number[] = [];
  const mockFiles: BinaryFile[] = [];
  for (let i = 0; i < size; i++) {
    const n = Math.round(Math.random() * range);
    numbers[i] = n;
    mockFiles[i] = mockBinaryFile(n);
  }
  return { numbers, mockFiles };
};

test("fuzz conversion", () => {
  const RANGE = 0x7bff;
  const TRIALS = 8888;
  const { numbers, mockFiles } = getRandomInputs(RANGE, TRIALS);

  for (let i = 0; i < TRIALS; i++) {
    const n = numbers[i];
    const f = mockFiles[i];
    const expected = Float16.fromBytes(n);
    const actual = Float16.fromBinaryFile(f);
    if (!Number.isFinite(expected)) {
      // this implementation doesn't handle infinity/NaN properly
      expect(actual).toEqual(0);
      continue;
    }
    expect(Math.abs(expected), `for ${n}`).toBeCloseTo(actual);
  }
});

test("benchmark", () => {
  const RANGE = 0x7bff;
  const TRIALS = 888888;
  const { numbers, mockFiles } = getRandomInputs(RANGE, TRIALS);

  console.time("native js");
  for (let i = 0; i < TRIALS; i++) {
    const n = numbers[i];
    Float16.fromBytes(n);
  }
  console.timeEnd("native js");

  console.time("kaitai");
  for (let i = 0; i < TRIALS; i++) {
    const f = mockFiles[i];
    Float16.fromBinaryFile(f);
  }
  console.timeEnd("kaitai");
});
