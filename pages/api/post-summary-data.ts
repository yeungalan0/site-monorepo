// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { getSortedPostsSummaryData } from "../../src/blog/lib/posts";

export default async function getPostSummaryData(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  res.statusCode = 200;
  const sortedPostsData = await getSortedPostsSummaryData();
  res.json(sortedPostsData);
}
