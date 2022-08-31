import Head from 'next/head';
import type { ReactNode } from 'react';

import { Logo } from './Logo';
import { Web3Button } from './Web3Button';

type Props = {
  children?: ReactNode;
  title?: string;
};

function HeaderRightArea() {
  return (
    <div className="order-last flex shrink-0 items-center">
      <Web3Button />
    </div>
  );
}

function Header() {
  return (
    <>
      <Head>
        <title>Walu</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
          charSet='="utf-8'
        />
      </Head>
      <header>
        <nav className="absolute top-0 right-0 z-30 flex h-16 w-full items-center justify-between bg-body px-4 transition-all duration-300 dark:bg-dark sm:h-24 sm:px-6 lg:px-8 xl:px-10 3xl:px-12">
          <div className="flex items-center">
            <Logo />
          </div>
          <HeaderRightArea />
        </nav>
      </header>
    </>
  );
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-dark">
      <Header />
      <main className="min-h-[100vh] px-4 pt-24 pb-4 sm:px-6 sm:pb-6 lg:px-8 xl:px-10 xl:pb-10 3xl:px-12">
        {children}
      </main>
    </div>
  );
}
