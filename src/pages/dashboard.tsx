import type { NextPage } from 'next';
import Link from 'next/link';

const DashboardPage: NextPage = () => (
  <>
    <h1>Dashboard</h1>
    <p>
      <Link href="/">
        <a>Go to home</a>
      </Link>
    </p>
  </>
);

export default DashboardPage;
