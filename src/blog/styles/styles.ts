import { makeStyles } from "@material-ui/core";
import theme from "../../theme";

const postStyles = makeStyles(() => ({
  date: {
    paddingBottom: theme.spacing(2),
  },
}));

const blogStyles = makeStyles(() => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

export { postStyles, blogStyles };
