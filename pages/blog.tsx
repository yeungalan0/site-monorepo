import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { useRef, useState } from "react";
import { VALID_TAGS } from "../src/blog/constants";
import { PostData } from "../src/blog/lib/posts";
import { blogStyles } from "../src/blog/styles/styles";
import { DefaultLayout } from "../src/layout";
import useSWR from "swr";
import Date from "../src/blog/components/date";

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
  const classes = blogStyles();
  const [postData, setPostData] = useState<PostData[]>(allPostsData);
  const [tags, setTags] = useState<string[]>([]);
  const isFirstRender = useRef(true);

  

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const shouldFetch = !isFirstRender.current;
  // TODO: Globally configured SWR
  const { data, error } = useSWR<PostData[], Error>(
    () =>
      shouldFetch ? `/api/post-summary-data?${buildTagsQuery(tags)}` : null,
    fetcher
  );

  if (data !== postData && data !== undefined) {
    setPostData(data);
  } else if (shouldFetch && error) {
    return <div>failed to load</div>;
  } else if (shouldFetch && !data) {
    return <div>loading...</div>;
  } else {
    isFirstRender.current = false;
  }

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTags(event.target.value as string[]);
  };

  return (
    <DefaultLayout head="blog" title="Posts">
      <FormControl className={classes.formControl}>
        <InputLabel>Tag(s)</InputLabel>
        <Select
          multiple
          value={tags}
          onChange={handleChange}
          input={<Input />}
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {VALID_TAGS.map((tag) => (
            <MenuItem key={tag} value={tag}>
              <Checkbox checked={tags.indexOf(tag) > -1} />
              <ListItemText primary={tag} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ul>
        {postData.map(({ id, date, title, tags }) => (
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

function buildTagsQuery(tags: string[]): string {
  return tags
    .map((tag) => {
      return `tags=${encodeURIComponent(tag)}`;
    })
    .join("&");
}