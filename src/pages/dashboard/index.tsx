import type { NextPage } from 'next';
import Link from 'next/link';

const DashboardPage: NextPage = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <Link href="/dashboard/assets">Assets</Link>
      <Link href="/dashboard/collectibles">Collectibles</Link>
      <Link href="/dashboard/vaults">Vaults</Link>
    </>
  );
};

export default DashboardPage;
