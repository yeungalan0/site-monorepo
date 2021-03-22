import { Typography } from "@material-ui/core";
import Date from "../../src/blog/components/date";
import { getAllPostIds, getPostData, PostData } from "../../src/blog/lib/posts";
import { useStyles } from "../../src/blog/styles/posts";
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
  const classes = useStyles();

  return (
    <DefaultLayout head={postData.title} title={postData.title}>
      <Typography align="center" color="textSecondary" className={classes.date}>
        <Date dateString={postData.date} />
      </Typography>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </DefaultLayout>
  );
}
