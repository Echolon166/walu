import type { NextPage } from 'next';
import Link from 'next/link';

import { useAssets } from '@/core/lukso';

const CollectiblesPage: NextPage = () => {
  const [result, loading] = useAssets();
  console.log(loading, result);

  return (
    <>
      <h1>Collectibles</h1>
      <Link href="/dashboard/assets">Assets</Link>
      <Link href="/dashboard/vaults">Vaults</Link>
    </>
  );
};

export default CollectiblesPage;
