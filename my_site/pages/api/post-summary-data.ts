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

export const querySchema: schema = {
  [FilterKeys.TAGS]: (value: string[]) => {
    const isValidTag = (tag: string) => VALID_TAGS.includes(tag);
    return value.every(isValidTag);
  },
};

export function validateQuery(query: QueryParams, mySchema: schema): Error[] {
  return Object.keys(query)
    .filter(
      (key) =>
        !Object.values(FilterKeys).includes(key as FilterKeys) ||
        !mySchema[key as FilterKeys](query[key])
    )
    .map((key) => new Error(`Key: '${key}' or associated value(s) is invalid`));
}

export default async function getPostSummaryData(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const queryParams: QueryParams = getQueryParams(req.query);

  const errors = validateQuery(queryParams, querySchema);

  if (errors.length > 0) {
    res.statusCode = 400; // Note: tested, order for this is important
    res.json(errors.map((error) => error.message));
  } else {
    const sortedPostsData = await getSortedPostsSummaryData(queryParams);
    res.statusCode = 200;
    res.json(sortedPostsData);
  }
}

export function getQueryParams(query: NextApiRequest["query"]): QueryParams {
  const queryParams: QueryParams = {};

  Object.keys(query).forEach((key) => {
    const value: string[] = Array.isArray(query[key])
      ? (query[key] as string[])
      : [query[key] as string];
    queryParams[key] = value;
  });

  return queryParams;
}
