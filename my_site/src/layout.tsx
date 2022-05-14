import {
  AppBar,
  Box,
  Divider,
  Drawer,
  Grid,
  GridSize,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slide,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { Fragment, ReactElement, useContext, useState } from "react";
import { useStyles } from "./style";
import { ToggleThemeContext } from "./theme-provider";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSession, signOut } from "next-auth/react";
import { darkTheme as theme } from "../src/theme";
import MenuIcon from "@mui/icons-material/Menu";

type DefaultLayoutProps = {
  children: JSX.Element | JSX.Element[];
  head?: string | null;
  title?: string | null;
  gridSizes?: CustomGridSizes;
};

type DefaultGridLayoutProps = {
  children: JSX.Element | JSX.Element[];
  title?: JSX.Element | null;
  gridSizes?: CustomGridSizes;
};

type CustomGridSizes = {
  xs: GridSize | false;
  sm: GridSize | false;
  md: GridSize | false;
  lg: GridSize | false;
  xl: GridSize | false;
};

function getEdgeSizes(contentSize: GridSize | false): {
  leftEdge: GridSize | false;
  rightEdge: GridSize | false;
} {
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

export function DefaultGridLayout({
  children,
  title = null,
  gridSizes = {
    xs: 12,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 4,
  },
}: DefaultGridLayoutProps): JSX.Element {
  const classes = useStyles();

  const { leftEdge: xsLeftEdge, rightEdge: xsRightEdge } = getEdgeSizes(
    gridSizes.xs
  );
  const { leftEdge: smLeftEdge, rightEdge: smRightEdge } = getEdgeSizes(
    gridSizes.sm
  );
  const { leftEdge: mdLeftEdge, rightEdge: mdRightEdge } = getEdgeSizes(
    gridSizes.md
  );
  const { leftEdge: lgLeftEdge, rightEdge: lgRightEdge } = getEdgeSizes(
    gridSizes.lg
  );
  const { leftEdge: xlLeftEdge, rightEdge: xlRightEdge } = getEdgeSizes(
    gridSizes.xl
  );

  return (
    <Grid container direction="column">
      {title}
      <Grid item container>
        <Grid
          item
          xs={xsLeftEdge}
          sm={smLeftEdge}
          md={mdLeftEdge}
          lg={lgLeftEdge}
          xl={xlLeftEdge}
        />
        <Grid
          item
          xs={gridSizes.xs}
          sm={gridSizes.sm}
          md={gridSizes.md}
          lg={gridSizes.lg}
          xl={gridSizes.xl}
          className={classes.contentGrid}
        >
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
  );
}

export function DefaultLayout({
  children,
  head = null,
  title = null,
  gridSizes = undefined,
}: DefaultLayoutProps): JSX.Element {
  return (
    <Fragment>
      <ConditionalHead head={head} />
      <DefaultGridLayout
        title={<ConditionalTitle title={title}></ConditionalTitle>}
        gridSizes={gridSizes}
      >
        {children}
      </DefaultGridLayout>
    </Fragment>
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
    return <Fragment></Fragment>;
  }

  return (
    <Grid item>
      <Typography variant="h3" align="center" className={classes.title}>
        {title}
      </Typography>
    </Grid>
  );
}

function HideOnScroll({
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactElement<any, any>;
}) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export function TopBar(): JSX.Element {
  const { data: session, status } = useSession();
  const { toggleTheme, darkThemeActive } = useContext(ToggleThemeContext);
  const isXSScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <HideOnScroll>
      <AppBar position="sticky" data-cy="top-bar">
        <DefaultGridLayout>
          {isXSScreen ? (
            <MobileTopBar
              toggleTheme={toggleTheme}
              darkThemeActive={darkThemeActive}
              status={status}
            />
          ) : (
            <DesktopTopBar
              toggleTheme={toggleTheme}
              darkThemeActive={darkThemeActive}
              status={status}
            />
          )}
        </DefaultGridLayout>
      </AppBar>
    </HideOnScroll>
  );
}

function DesktopTopBar({
  toggleTheme,
  darkThemeActive,
  status,
}: {
  toggleTheme: () => void;
  darkThemeActive: boolean;
  status: "authenticated" | "loading" | "unauthenticated";
}): JSX.Element {
  const classes = useStyles();

  return (
    <Toolbar className={classes.desktopTopBar}>
      <Typography color="textSecondary" variant="h6" className={classes.topic}>
        <Link href={`/blog`}>
          <a data-cy="top-bar-blog">Blog</a>
        </Link>
      </Typography>
      <Typography color="textSecondary" variant="h6" className={classes.topic}>
        <Link href={`/about`}>
          <a data-cy="top-bar-about">About</a>
        </Link>
      </Typography>
      <Typography color="textSecondary" variant="h6" className={classes.topic}>
        <Link href={`/blog?tags=projects`}>
          <a data-cy="top-bar-projects">Projects</a>
        </Link>
      </Typography>
      <Typography color="textSecondary" variant="h6" className={classes.topic}>
        <Link href={`/resume`}>
          <a data-cy="top-bar-resume">Resume</a>
        </Link>
      </Typography>
      <Tooltip title="Toggle Theme">
        <IconButton
          sx={{ ml: 1 }}
          onClick={toggleTheme}
          color="inherit"
          data-cy="top-bar-toggle-theme"
        >
          {darkThemeActive ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Tooltip>
      {status === "authenticated" && (
        <Tooltip title="Sign Out">
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => {
              signOut();
            }}
            color="inherit"
            data-cy="top-bar-sign-out"
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

function MobileTopBar({
  toggleTheme,
  darkThemeActive,
  status,
}: {
  toggleTheme: () => void;
  darkThemeActive: boolean;
  status: "authenticated" | "loading" | "unauthenticated";
}): JSX.Element {
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);

  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerIsVisible(false)}
      onKeyDown={() => setDrawerIsVisible(false)}
    >
      <List>
        <ListItem button component="a" href="/blog" data-cy="top-bar-blog">
          <ListItemText primary="Blog" />
        </ListItem>
        <ListItem button component="a" href="/about" data-cy="top-bar-about">
          <ListItemText primary="About" />
        </ListItem>
        <ListItem
          button
          component="a"
          href="/blog?tags=projects"
          data-cy="top-bar-projects"
        >
          <ListItemText primary="Projects" />
        </ListItem>
        <ListItem button component="a" href="/resume" data-cy="top-bar-resume">
          <ListItemText primary="Resume" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={toggleTheme}>
          <ListItemIcon>
            {darkThemeActive ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText primary="Toggle theme" />
        </ListItem>
        {status === "authenticated" && (
          <ListItem button onClick={() => signOut()}>
            <ListItemIcon data-cy="top-bar-sign-out">
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={() => setDrawerIsVisible(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={drawerIsVisible} onClose={() => setDrawerIsVisible(false)}>
        {list}
      </Drawer>
    </Toolbar>
  );
}
