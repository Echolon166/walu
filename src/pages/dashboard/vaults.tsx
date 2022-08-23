import type { NextPage } from 'next';
import Link from 'next/link';

const VaultsPage: NextPage = () => {
  return (
    <>
      <h1>Vaults</h1>
      <Link href="/dashboard/assets">Assets</Link>
      <Link href="/dashboard/collectibles">Collectibles</Link>
    </>
  );
};

export default VaultsPage;
