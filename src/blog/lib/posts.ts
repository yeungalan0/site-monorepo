/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import { VALID_TAGS } from "../constants";
// @ts-ignore
import headings from "remark-autolink-headings";
// @ts-ignore
import slug from "remark-slug";
import { FilterKeys, QueryParams } from "../../../pages/api/post-summary-data";

const postsDirectory = path.join(process.cwd(), "posts");
const charLimit = 400;

export type PostData = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  contentHtml: string;
};

export async function getSortedPostsSummaryData(
  queryParams: QueryParams
): Promise<PostData[]> {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsDataPromises: Promise<PostData>[] = fileNames.map(
    (fileName) => {
      const id = fileName.replace(/\.md$/, "");

      return getPostData(id).then((postData) => {
        postData.contentHtml = getSnippet(postData.contentHtml, charLimit);
        return postData;
      });
    }
  );

  let allPostsData: PostData[] = await Promise.all(allPostsDataPromises);
  allPostsData = applyFilters(allPostsData, queryParams);

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

function applyFilters(
  allPostsData: PostData[],
  queryParams: QueryParams
): PostData[] {
  return allPostsData.filter((postData) => {
    let meetsFilterCriteria = true;
    if (FilterKeys.TAGS in queryParams) {
      const containsFilterTags = queryParams[FilterKeys.TAGS].every((tag) =>
        postData.tags.includes(tag)
      );
      meetsFilterCriteria = containsFilterTags;
    }

    return meetsFilterCriteria;
  });
}

function getSnippet(text: string, charLimit: number): string {
  if (text.length > charLimit) {
    const i = text.indexOf(" ", charLimit);
    return text.substring(0, i) + "...";
  }
  return text;
}

export function getAllPostIds(): {
  params: {
    id: string;
  };
}[] {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(slug)
    .use(headings, { behavior: "wrap" })
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const title: string = matterResult.data.title;
  const date: string = matterResult.data.date;
  const tags: string[] = matterResult.data.tags;
  validateTags(tags);

  // Combine the data with the id
  const data: PostData = { id, title, date, tags, contentHtml };

  return data;
}

function validateTags(tags: string[]) {
  tags.forEach((tag) => {
    if (!VALID_TAGS.includes(tag)) {
      throw Error("invalid tag!");
    }
  });
}

export const testables = {
  applyFilters: applyFilters,
  getSnippet: getSnippet,
};
