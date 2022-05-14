import { AppProps } from "next/dist/shared/lib/router/router";
import React, { useEffect, useState } from "react";
import { TopBar } from "../src/layout";
import CustomThemeProvider from "../src/theme-provider";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
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
        <SessionProvider session={pageProps.session}>
          <TopBar />
          <Component {...pageProps} />
        </SessionProvider>
      </CustomThemeProvider>
    </div>
  );
}

export default MyApp;
