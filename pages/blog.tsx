import { Link, Typography } from "@material-ui/core";
import Date from "../src/blog/components/date";
import { PostData } from "../src/blog/lib/posts";
import { DefaultLayout } from "../src/layout";

export async function getStaticProps(): Promise<{
  props: {
    allPostsData: PostData[];
  };
}> {
  const res = await fetch("http://localhost:3000/api/post-summary-data");
  const allPostsData: PostData[] = await res.json();

  return {
    props: {
      allPostsData,
    },
  };
}

// TODO: Eventually pagination will become useful here
export default function Blog({
  allPostsData,
}: {
  allPostsData: PostData[];
}): JSX.Element {
  return (
    <DefaultLayout head="blog" title="Posts">
      <ul>
        {allPostsData.map(({ id, date, title, tags }) => (
          <li key={id} style={{ listStyleType: "none" }}>
            <Link href={`/posts/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <small>
              <Typography color="textSecondary">
                <Date dateString={date} />
              </Typography>
              <Typography color="textPrimary">
                Tags: {tags.join(", ")}
              </Typography>
            </small>
          </li>
        ))}
      </ul>
    </DefaultLayout>
  );
}
