import Head from 'next/head';
import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Header = () => (
  <>
    <Head>
      <title>Walu</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        |{' '}
        <Link href="/dashboard">
          <a>Dashboard</a>
        </Link>
      </nav>
    </header>
  </>
);

const Footer = () => (
  <footer>
    <hr />
    <span>I&quot;m here to stay (Footer)</span>
  </footer>
);

export const Layout = ({ children }: Props) => (
  <div className="grid place-items-center">
    <Header></Header>
    {children}
    <Footer></Footer>
  </div>
);
