import {
  FilterKeys,
  testables,
  QueryParams,
} from "../../../pages/api/post-summary-data";
import { VALID_TAGS } from "../constants";

const { querySchema, validate } = testables;

describe("querySchema", () => {
  test("should return true on valid tags", () => {
    const expectedOutput = true;
    const testCase = [VALID_TAGS[0], VALID_TAGS[1], VALID_TAGS[2]];

    const actualOutput = querySchema[FilterKeys.TAGS](testCase);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  test("should return false on invalid tags", () => {
    const expectedOutput = false;
    const testCase = [VALID_TAGS[0], "invalid", VALID_TAGS[2]];

    const actualOutput = querySchema[FilterKeys.TAGS](testCase);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });
});

describe("validate", () => {
  test("should return no errors on valid query", () => {
    const expectedOutput: Error[] = [];
    const testCase: QueryParams = {
      [FilterKeys.TAGS]: [VALID_TAGS[0], VALID_TAGS[1], VALID_TAGS[2]],
    };

    const actualOutput = validate(testCase, querySchema);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  test("should return errors on invalid query value", () => {
    const expectedErrorNumber = 1
    const testCase: QueryParams = {
      [FilterKeys.TAGS]: [VALID_TAGS[0], "invalid", VALID_TAGS[2]],
    };

    const actualOutput = validate(testCase, querySchema);

    expect(actualOutput.length).toStrictEqual(expectedErrorNumber);
  });

  test("should return errors on invalid key value", () => {
    const expectedErrorNumber = 1
    const testCase: QueryParams = {
      [FilterKeys.TAGS]: [VALID_TAGS[0], VALID_TAGS[1], VALID_TAGS[2]],
      invalid: ["testing"]
    };

    const actualOutput = validate(testCase, querySchema);

    expect(actualOutput.length).toStrictEqual(expectedErrorNumber);
  });
});
