import { expect, test } from "vitest";
import KaitaiFloat16 from "../kaitai/F2";

type BinaryFile = ReturnType<typeof mockBinaryFile>;
const mockBinaryFile = (n: number) => ({
  readU2le() {
    return n;
  },
});

class Float16 {
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
  const TRIALS = 88888;
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
  const TRIALS = 88888;
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
