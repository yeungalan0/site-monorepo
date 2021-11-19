import { Box, Typography } from "@material-ui/core";
import { DefaultLayout } from "../src/layout";
import { useStyles } from "../src/style";

export default function About(): JSX.Element {
  const classes = useStyles();

  return (
    <DefaultLayout head={"about"} title={""}>
      <img className={classes.myImage} src="photos/me.jpg" />
      <br />
      <Box className={classes.paragraph}>
        <Typography>
          Hello 👋, my name is Alan, and I like to learn things, and then try
          and use what I learned to make things. Most of the time what I make
          isn&apos;t super useful, but you can bet I had a lot of fun doing it!
          I&apos;m creating this site to document what I&apos;ve made, learned,
          and other things that keep me up at night. I hope you enjoy reading!
        </Typography>
      </Box>
    </DefaultLayout>
  );
}
