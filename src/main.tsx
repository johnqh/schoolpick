import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BrowserRouter } from "react-router-dom";
import { SEOHead, SEOHeadProvider } from "@sudobility/seo_lib";
import App from "./App.tsx";
import { seoHeadConfig } from "./seoHead";
import "./i18n";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SEOHeadProvider config={seoHeadConfig}>
        <SEOHead
          title={seoHeadConfig.appName}
          description={seoHeadConfig.appName}
        />
        <ThemeProvider attribute="class">
          <ConvexProvider client={convex}>
            <App />
          </ConvexProvider>
        </ThemeProvider>
      </SEOHeadProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
