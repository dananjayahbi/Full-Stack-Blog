'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Roboto } from 'next/font/google';
import { theme } from '@/lib/theme';
import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';

// Define fonts
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Create a client-side cache, shared for the whole session of the user in the browser.
// This is based on the official MUI example with better error handling
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const options = { key: 'mui', prepend: true };
  
  const [{ cache, flush }] = React.useState(() => {
    try {
      // Create a new cache for each client
      const cache = createCache(options);
      const flush = () => {
        if (!cache || !cache.inserted || typeof cache.insert !== 'function') {
          return [];
        }
        
        try {
          const result = Object.keys(cache.inserted);
          // After flushing, clear the inserted cache to avoid reusing it
          for (const key of result) {
            delete cache.inserted[key];
          }
          return result;
        } catch (error) {
          console.error('Error flushing emotion cache:', error);
          return [];
        }
      };
      
      return { cache, flush };
    } catch (error) {
      console.error('Error creating emotion cache:', error);
      // Fallback cache that won't cause errors
      const emptyCache = {
        insert: () => '',
        inserted: {},
        registered: {},
        key: options.key,
        nonce: undefined,
        compat: true,
        sheet: { insert: () => {}, flush: () => {}, speedy: false, tags: [] }
      } as unknown as EmotionCache;
      
      return {
        cache: emptyCache,
        flush: () => []
      };
    }
  });

  // Use CSS insertions from emotion to inject styles into HTML
  useServerInsertedHTML(() => {
    try {
      const names = flush();
      if (names.length === 0) {
        return null;
      }
      
      let styles = '';
      for (const name of names) {
        if (cache.inserted && cache.inserted[name]) {
          styles += cache.inserted[name];
        }
      }
      
      if (!styles) {
        return null;
      }
      
      return (
        <style
          key={cache.key}
          data-emotion={`${cache.key} ${names.join(' ')}`}
          dangerouslySetInnerHTML={{ __html: styles }}
        />
      );
    } catch (error) {
      console.error('Error inserting HTML:', error);
      return null;
    }
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}