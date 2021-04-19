import React, { useCallback, useEffect, useState } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { lightTheme, darkTheme } from "./theme";
import { Theme } from "@material-ui/core";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ToggleThemeContext = React.createContext({
  toggleTheme: () => {
    console.log();
  },
  darkThemeActive: false,
});

type SelectedTheme = {
  themeName: string;
  appliedTheme: Theme;
};

const themeStorageKey = "theme"

enum ThemeName {
  DARK_THEME = "darkTheme",
  LIGHT_THEME = "lightTheme",
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}: ThemeProviderProps) => {
  const [selectedTheme, setSelectedTheme] = useState<SelectedTheme>({
    appliedTheme: darkTheme,
    themeName: ThemeName.DARK_THEME,
  });

  useEffect(() => {
    const theme = localStorage.getItem(themeStorageKey);
    if (theme && theme === ThemeName.LIGHT_THEME) {
      setSelectedTheme({ appliedTheme: lightTheme, themeName: ThemeName.LIGHT_THEME });
    }
  }, []);

  const toggleTheme = useCallback(() => {
      if (!selectedTheme || selectedTheme.themeName === ThemeName.DARK_THEME) {
      setSelectedTheme({ appliedTheme: lightTheme, themeName: ThemeName.LIGHT_THEME });
      localStorage.setItem(themeStorageKey, ThemeName.LIGHT_THEME);
    } else {
      setSelectedTheme({ appliedTheme: darkTheme, themeName: ThemeName.DARK_THEME });
      localStorage.setItem(themeStorageKey, ThemeName.DARK_THEME);
    }
  }, [selectedTheme, setSelectedTheme]);

  return (
    <ToggleThemeContext.Provider
      value={{
        toggleTheme,
        darkThemeActive: !(selectedTheme.themeName === ThemeName.LIGHT_THEME),
      }}
    >
      <MuiThemeProvider theme={selectedTheme.appliedTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ToggleThemeContext.Provider>
  );
};

export default CustomThemeProvider;
