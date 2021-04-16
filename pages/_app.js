import { ThemeProvider } from "@material-ui/styles";
import { useEffect } from "react";
import "../styles/globals.css";
import theme from "../src/theme";
import { CssBaseline } from "@material-ui/core";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
