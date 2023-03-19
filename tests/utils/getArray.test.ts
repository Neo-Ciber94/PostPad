import { getArray } from "@/lib/utils/getArray";
import { describe, test, expect } from "vitest";

describe("getArray", () => {
  test("for array return array", () => {
    const result = getArray([1, 2, 3]);
    expect(result).toStrictEqual([1, 2, 3]);
  });

  test("for value return array", () => {
    const result = getArray(69);
    expect(result).toStrictEqual([69]);
  });
});
