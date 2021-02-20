import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Header = (): JSX.Element => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography>TODO</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
