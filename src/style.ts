import { makeStyles } from "@material-ui/core";
import { darkTheme as theme } from "./theme";

const useStyles = makeStyles(() => ({
  topic: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    "&:hover": {
      color: theme.palette.text.primary,
      textDecoration: "underline",
    },
  },
  title: {
    padding: theme.spacing(3),
  },
  contentGrid: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export { useStyles };
