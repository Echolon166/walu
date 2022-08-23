import type { NextPage } from 'next';
import Link from 'next/link';

import { useAssets } from '@/core/lukso';

const AssetsPage: NextPage = () => {
  const [result, loading] = useAssets();
  console.log(loading, result);

  return (
    <>
      <h1>Assets</h1>
      <Link href="/dashboard/collectibles">Collectibles</Link>
      <Link href="/dashboard/vaults">Vaults</Link>
    </>
  );
};

export default AssetsPage;
