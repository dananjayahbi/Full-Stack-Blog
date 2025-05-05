'use client';

import { useState } from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Roboto } from 'next/font/google';
import { theme } from '@/lib/theme';

// Define fonts
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// This implementation is from the official Material UI example
// https://github.com/mui/material-ui/blob/master/examples/material-ui-nextjs-ts/src/components/ThemeRegistry/ThemeRegistry.tsx
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({
      key: 'mui',
      prepend: true,
    });
    cache.compat = true;

    function flush() {
      const prevInsertionPoint = cache.insert('');
      cache.insert = prevInsertionPoint;
      return prevInsertionPoint;
    }

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={roboto.className}>{children}</div>
      </ThemeProvider>
    </CacheProvider>
  );
}