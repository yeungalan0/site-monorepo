import { createTheme, ThemeOptions } from "@material-ui/core/styles";

function getThemeOptions(darkThemeActive: boolean): ThemeOptions {
  return {
    palette: {
      type: darkThemeActive ? "dark" : "light",
    },
  };
}

export const darkTheme = createTheme(getThemeOptions(true));
export const lightTheme = createTheme(getThemeOptions(false));
