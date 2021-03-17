import { Grid, Typography } from "@material-ui/core";
import Header from "../src/header";

export default function About(): JSX.Element {
  return (
    <Grid container direction="column">
      <Grid item>
        <Header />
      </Grid>
      <Grid item>
        <Typography variant="h3" align="center">
          Hello 👋
        </Typography>
      </Grid>
      <Grid item container>
        <Grid item sm={2} md={3} />
        <Grid item xs={12} sm={8} md={6}>
          <Content />
        </Grid>
        <Grid item sm={2} md={3} />
      </Grid>
    </Grid>
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
