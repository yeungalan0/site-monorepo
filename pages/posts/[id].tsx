import { Fragment } from "react";
import { getAllPostIds, getPostData, PostData } from "../../src/lib/posts";

export async function getStaticProps({
  // TODO: Fix this
  params,
}): Promise<{
  props: {
    postData: PostData;
  };
}> {
  const postData = getPostData(params.id);
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
  return (
    <Fragment>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
    </Fragment>
  );
}
