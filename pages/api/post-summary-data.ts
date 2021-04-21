// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { VALID_TAGS } from "../../src/blog/constants";
import { getSortedPostsSummaryData } from "../../src/blog/lib/posts";

export enum FilterKeys {
  TAGS = "tags",
}

type schema = {
  [key in FilterKeys]: (value: string[]) => boolean;
};

export type QueryParams = {
  [key: string]: string[];
};

const querySchema: schema = {
  [FilterKeys.TAGS]: (value: string[]) => {
    const isValidTag = (tag: string) => VALID_TAGS.includes(tag);
    return value.every(isValidTag);
  },
};

function validate(query: QueryParams, mySchema: schema) {
  return Object.keys(query)
    .filter(
      (key) =>
        !Object.values(FilterKeys).includes(key as FilterKeys) ||
        !mySchema[key as FilterKeys](query[key])
    )
    .map((key) => new Error(`Key: '${key}' is invalid.`));
}

export default async function getPostSummaryData(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const queryParams: QueryParams = getQueryParams(req.query);

  const errors = validate(queryParams, querySchema);

  if (errors.length > 0) {
    res.json(errors.map((error) => error.message));
    res.statusCode = 400;
  } else {
    const sortedPostsData = await getSortedPostsSummaryData(queryParams);
    res.json(sortedPostsData);
    res.statusCode = 200;
  }
}

function getQueryParams(query: NextApiRequest["query"]): QueryParams {
  const queryParams: QueryParams = {};

  Object.keys(query).forEach((key) => {
    const value: string[] = Array.isArray(query[key])
      ? (query[key] as string[])
      : [query[key] as string];
    queryParams[key] = value;
  });

  return queryParams;
}

export const testables = {
  querySchema: querySchema,
  validate: validate,
};
