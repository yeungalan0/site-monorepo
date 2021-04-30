import { createMuiTheme, ThemeOptions } from "@material-ui/core/styles";

function getThemeOptions(darkThemeActive: boolean): ThemeOptions {
  return {
    palette: {
      type: darkThemeActive ? "dark" : "light",
    },
  };
}

export const darkTheme = createMuiTheme(getThemeOptions(true));
export const lightTheme = createMuiTheme(getThemeOptions(false));
