import '../styles/globals.css';

import type { AppProps } from 'next/app';

import { Layout } from '@/components';
import { Web3ContextProvider } from '@/core/web3';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ContextProvider>
  );
}

export default MyApp;
