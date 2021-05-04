import { Typography } from "@material-ui/core";
import { DefaultLayout } from "../src/layout";

export default function About(): JSX.Element {
  return (
    <DefaultLayout head={"about"} title={"Hello 👋"}>
      <Content />
    </DefaultLayout>
  );
}

function Content() {
  return (
    <Typography>
      My name is Alan, and I like to learn things, and then try and use what I
      learned to make things. Most of the time what I make isn&apos;t super
      useful, but you can bet I had a lot of fun doing it! I&apos;m creating
      this site to document what I&apos;ve made, learned, and other things that
      keep me up at night. I hope you enjoy reading!
    </Typography>
  );
}
