import React, { useEffect, useState } from "react";
import "../styles/globals.css";
import CustomThemeProvider from "../src/theme-provider";
import { AppProps } from "next/dist/next-server/lib/router/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [style, setStyle] = useState<React.CSSProperties>({
    visibility: "hidden",
  });

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
    setStyle({});
  }, []);

  return (
    // style needed otherwise site might "flash" with different theme settings
    <div style={style}>
      <CustomThemeProvider>
        <Component {...pageProps} />
      </CustomThemeProvider>
    </div>
  );
}

export default MyApp;
