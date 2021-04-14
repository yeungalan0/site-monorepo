import {
  Box,
  Card,
  CardActionArea,
  Checkbox,
  FormControl,
  Grid,
  GridListTile,
  Input,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { VALID_TAGS } from "../src/blog/constants";
import { getSortedPostsSummaryData, PostData } from "../src/blog/lib/posts";
import { blogStyles } from "../src/blog/styles/styles";
import { DefaultLayout } from "../src/layout";
import useSWR from "swr";
import Date from "../src/blog/components/date";
import theme from "../src/theme";

export async function getStaticProps(): Promise<{
  props: {
    allPostsData: PostData[];
  };
}> {
  const allPostsData = await getSortedPostsSummaryData({})

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

  return (
    <DefaultLayout head="blog" title="Posts">
      <FilterByTags tags={tags} setTags={setTags} />
      <Grid container spacing={3} direction="column">
        {postData.map(({ id, date, title, tags }) => (
          <Grid item key={id}>
            <PostCard id={id} title={title} date={date} tags={tags} />
          </Grid>
        ))}
      </Grid>
    </DefaultLayout>
  );
}

function PostCard({
  id,
  title,
  date,
  tags,
}: {
  id: string;
  title: string;
  date: string;
  tags: string[];
}): JSX.Element {
  return (
    <Link href={`/posts/${id}`}>
      <Card variant="outlined">
        <CardActionArea>
          <Box margin={theme.spacing(0.5)} textAlign="center">
            <Typography>
              <Link href={`/posts/${id}`}>{title}</Link>
            </Typography>
            <small>
              <br />
              <Typography color="textSecondary">
                <Date dateString={date} />
              </Typography>
              <br />
              <Typography color="textSecondary">
                Tags: {tags.join(", ")}
              </Typography>
            </small>
          </Box>
        </CardActionArea>
      </Card>
    </Link>
  );
}

function FilterByTags({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
}): JSX.Element {
  const classes = blogStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTags(event.target.value as string[]);
  };

  return (
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
  );
}

function buildTagsQuery(tags: string[]): string {
  return tags
    .map((tag) => {
      return `tags=${encodeURIComponent(tag)}`;
    })
    .join("&");
}
