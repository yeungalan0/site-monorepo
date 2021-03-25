import { Link, Typography } from "@material-ui/core";
import useSWR from "swr";
import Date from "../src/blog/components/date";
import { getSortedPostsSummaryData, PostData } from "../src/blog/lib/posts";
import { DefaultLayout } from "../src/layout";

export async function getStaticProps(): Promise<{
  props: {
    allPostsData: PostData[];
  };
}> {
  const allPostsData = await getSortedPostsSummaryData();
  return {
    props: {
      allPostsData,
    },
  };
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// TODO: Eventually pagination will become useful here
export default function Blog({
  allPostsData,
}: {
  allPostsData: PostData[];
}): JSX.Element {
  return (
    <DefaultLayout head="blog" title="Posts">
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id} style={{ listStyleType: "none" }}>
            <Link href={`/posts/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <small>
              <Typography color="textSecondary">
                <Date dateString={date} />
              </Typography>
            </small>
          </li>
        ))}
      </ul>
      <Posts />
    </DefaultLayout>
  );
}

function Posts(): JSX.Element {
  const { data, error } = useSWR("/api/post-summary-data", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return <div>hello {JSON.stringify(data)}!</div>;
}
