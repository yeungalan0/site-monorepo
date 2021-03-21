import { Link, Typography } from "@material-ui/core";
import Date from "../src/blog/components/date";
import { getSortedPostsData, PostData } from "../src/blog/lib/posts";

export async function getStaticProps(): Promise<{
  props: {
    allPostsData: PostData[];
  };
}> {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Blog({
  allPostsData,
}: {
  allPostsData: PostData[];
}): JSX.Element {
  return (
    <section>
      <h2>Blog</h2>
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
    </section>
  );
}
