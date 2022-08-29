import type { NextPage } from 'next';
import Link from 'next/link';

import ProfileTab from '@/components/ProfileTab';
import { useAssets } from '@/core/lukso';

const AssetsPage: NextPage = () => {
  const [assets, loading] = useAssets();
  console.log(loading, assets.lsp7);
  console.log(loading, assets.lsp8);

  return (
    <>
      <h1>Assets</h1>
      <Link href="/dashboard/collectibles">Collectibles</Link>
      <Link href="/dashboard/vaults">Vaults</Link>
      <ProfileTab assets={assets} />
    </>
  );
};

export default AssetsPage;
