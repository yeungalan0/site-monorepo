import { makeStyles } from "@material-ui/core";
import theme from "./theme";

const useStyles = makeStyles(() => ({
  topic: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    "&:hover": {
      color: theme.palette.text.primary,
      textDecoration: "underline",
    },
  },
  title: {
    padding: theme.spacing(3),
  },
}));

export { useStyles };
