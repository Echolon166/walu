import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

import Layout from '@/components/Layout';
import { Web3ContextProvider } from '@/core/web3';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <Web3ContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3ContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
