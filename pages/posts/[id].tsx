import { Typography } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
// @ts-ignore
import headings from "remark-autolink-headings";
import footnotes from "remark-footnotes";
// @ts-ignore
import slug from "remark-slug";
import Date from "../../src/blog/components/date";
import { getAllPostIds, getPostData, PostData } from "../../src/blog/lib/posts";
import { postStyles } from "../../src/blog/styles/styles";
import { DefaultLayout } from "../../src/layout";

type postParam = {
  id: string;
};

export async function getStaticProps({
  params,
}: {
  params: postParam;
}): Promise<{
  props: {
    postData: PostData;
  };
}> {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths(): Promise<{
  paths: {
    params: {
      id: string;
    };
  }[];
  fallback: boolean;
}> {
  const paths = getAllPostIds();

  return {
    paths,
    fallback: false,
  };
}

export default function Post({
  postData,
}: {
  postData: PostData;
}): JSX.Element {
  const classes = postStyles();

  return (
    <DefaultLayout head={postData.title} title={postData.title}>
      <Typography align="center" color="textSecondary" className={classes.date}>
        <Date dateString={postData.date} />
      </Typography>
      <ReactMarkdown
        remarkPlugins={[slug, [headings, { behavior: "wrap" }], footnotes]}
        children={postData.contentMarkdown}
      />
    </DefaultLayout>
  );
}
