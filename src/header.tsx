import { AppBar, Toolbar, Typography } from "@material-ui/core";
import Link from "next/link";

const Header = (): JSX.Element => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography color="textPrimary" variant="h6">
          <Link href={`/about`}>
            <a>About</a>
          </Link>
        </Typography>
        <Typography color="textPrimary" variant="h6">
          <Link href={`/blog`}>
            <a>Blog</a>
          </Link>
        </Typography>
        <Typography color="textPrimary" variant="h6">
          <Link href={`/blog`}>
            <a>Resume</a>
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
