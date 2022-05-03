export const APPROX_WEEKS_PER_YEAR = 52;

export const EXACT_WEEKS_PER_YEAR = 52.143;

export const AVERAGE_LIFE_EXPECTANCY_YEARS_MALE = 76.3;

export const CELL_WIDTH = ".75%";

export const TEST_ENV = "test";

export const MAX_VH = "85vh";

// Using value from https://hextobinary.com/unit/time/from/year/to/ms
const MILLIS_IN_STANDARD_YEAR = 31557600000;

export const AVERAGE_LIFE_EXPECTANCY_MILLIS_MALE = Math.round(
  AVERAGE_LIFE_EXPECTANCY_YEARS_MALE * MILLIS_IN_STANDARD_YEAR
);

export type PeopleData = {
  resourceName: string;
  etag: string;
  birthdays:
    | {
        metadata: {
          primary: boolean | undefined;
          source: {
            type: string;
            id: string;
          };
        };
        date: {
          year: number | undefined;
          month: number;
          day: number;
        };
      }[]
    | undefined;
};

export type Birthdate = {
  year: number;
  month: number;
  day: number;
};

export enum Providers {
  GOOGLE = "google",
}

export class BadRequestError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}
