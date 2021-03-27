import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");
const charLimit = 400;

export type PostData = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  contentHtml: string;
};

export async function getSortedPostsSummaryData(): Promise<PostData[]> {
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

  const allPostsData: PostData[] = await Promise.all(allPostsDataPromises);

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

function getSnippet(text: string, charLimit: number) {
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
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const title: string = matterResult.data.title;
  const date: string = matterResult.data.date;
  // TODO: Validate tags
  const tags: string[] = matterResult.data.tags;

  // Combine the data with the id
  const data: PostData = { id, title, date, tags, contentHtml };

  return data;
}
