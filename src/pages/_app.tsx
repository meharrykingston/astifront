import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import "../styles/globals.css";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const path = router.asPath || "";
  const shouldLoadClarity =
    !path.startsWith("/indexcontrol") && !path.startsWith("/supermadin");
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    if (!shouldLoadClarity) return;
    const payload = {
      level: "info",
      message: "page_view",
      source: "frontend",
      meta: { path },
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/logs/ingest`, blob);
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/logs/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => undefined);
    }
  }, [path, shouldLoadClarity]);

  useEffect(() => {
    const handleStart = () => setRouteLoading(true);
    const handleStop = () => setRouteLoading(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router.events]);

  return (
    <>
      {shouldLoadClarity && (
        <Script id="clarity-tag" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "twq4peq2u7");`}
        </Script>
      )}
      {routeLoading && (
        <div className="global-loader">
          <div className="global-loader__spinner" />
          <p className="global-loader__text">Loading...</p>
        </div>
      )}
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}
