export const WEEKS_PER_YEAR = 52;

export const AVERAGE_LIFE_EXPECTANCY_MALE = 76.3;

export const CELL_WIDTH = ".75%";

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
