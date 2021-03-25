import { AppBar, Grid, Toolbar, GridSize, Typography } from "@material-ui/core";
import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import { useStyles } from "./style";

type DefaultLayoutProps = {
  children: JSX.Element | JSX.Element[];
  head?: string | null;
  title?: string | null;
  xs?: GridSize | false;
  sm?: GridSize | false;
  md?: GridSize | false;
  lg?: GridSize | false;
  xl?: GridSize | false;
  renderHeader?: boolean;
};

function getEdgeSizes(
  contentSize: GridSize | false
): { leftEdge: GridSize | false; rightEdge: GridSize | false } {
  let leftEdge: GridSize | false = Math.floor(
    (12 - (contentSize as number)) / 2
  ) as GridSize;
  let rightEdge: GridSize | false = (12 -
    (contentSize as number) -
    (leftEdge as number)) as GridSize;

  leftEdge = (leftEdge as number) == 0 ? false : leftEdge;
  rightEdge = (rightEdge as number) == 0 ? false : rightEdge;

  return { leftEdge, rightEdge };
}

export function DefaultLayout({
  children,
  head = null,
  title = null,
  xs = 12,
  sm = 8,
  md = 6,
  lg = 4,
  xl = 4,
  renderHeader = true,
}: DefaultLayoutProps): JSX.Element {
  const { leftEdge: xsLeftEdge, rightEdge: xsRightEdge } = getEdgeSizes(xs);
  const { leftEdge: smLeftEdge, rightEdge: smRightEdge } = getEdgeSizes(sm);
  const { leftEdge: mdLeftEdge, rightEdge: mdRightEdge } = getEdgeSizes(md);
  const { leftEdge: lgLeftEdge, rightEdge: lgRightEdge } = getEdgeSizes(lg);
  const { leftEdge: xlLeftEdge, rightEdge: xlRightEdge } = getEdgeSizes(xl);

  return (
    <Fragment>
      <ConditionalHead head={head} />
      <Grid container direction="column">
        <ConditionalHeader renderHeader={renderHeader} />
        <ConditionalTitle title={title} />
        <Grid item container>
          <Grid
            item
            xs={xsLeftEdge}
            sm={smLeftEdge}
            md={mdLeftEdge}
            lg={lgLeftEdge}
            xl={xlLeftEdge}
          />
          <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
            {children}
          </Grid>
          <Grid
            item
            xs={xsRightEdge}
            sm={smRightEdge}
            md={mdRightEdge}
            lg={lgRightEdge}
            xl={xlRightEdge}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}

function ConditionalHeader({ renderHeader }: { renderHeader: boolean }) {
  if (!renderHeader) {
    return <></>;
  }

  return (
    <Grid item>
      <Header />
    </Grid>
  );
}

function ConditionalHead({ head }: { head: string | null }): JSX.Element {
  if (head === null) {
    return <></>;
  }

  return (
    <Head>
      <title>{head}</title>
    </Head>
  );
}

function ConditionalTitle({ title }: { title: string | null }): JSX.Element {
  const classes = useStyles();

  if (title === null) {
    return <></>;
  }

  return (
    <Grid item>
      <Typography variant="h3" align="center" className={classes.title}>
        {title}
      </Typography>
    </Grid>
  );
}

export function Header(): JSX.Element {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <DefaultLayout renderHeader={false}>
        <Toolbar>
          <Typography
            color="textSecondary"
            variant="h6"
            className={classes.topic}
          >
            <Link href={`/blog`}>
              <a>Blog</a>
            </Link>
          </Typography>
          <Typography
            color="textSecondary"
            variant="h6"
            className={classes.topic}
          >
            <Link href={`/about`}>
              <a>About</a>
            </Link>
          </Typography>
          <Typography
            color="textSecondary"
            variant="h6"
            className={classes.topic}
          >
            <Link href={`/blog`}>
              <a>Projects</a>
            </Link>
          </Typography>
          <Typography
            color="textSecondary"
            variant="h6"
            className={classes.topic}
          >
            <Link href={`/blog`}>
              <a>Resume</a>
            </Link>
          </Typography>
        </Toolbar>
      </DefaultLayout>
    </AppBar>
  );
}
