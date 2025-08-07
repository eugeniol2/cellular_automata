// src/components/ThemeRegistry/ThemeRegistry.tsx
"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";

import theme from "@/app/theme/theme";

const createEmotionCache = () => {
  return createCache({ key: "css" });
};

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache, setCache] = useState(createEmotionCache());

  useEffect(() => {
    setCache(createEmotionCache());
  }, []);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
