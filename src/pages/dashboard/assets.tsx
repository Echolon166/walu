import type { NextPage } from 'next';
import Link from 'next/link';

import type { Lsp7Asset } from '@/core/lukso';
import { useAssets } from '@/core/lukso';

const AssetsPage: NextPage = () => {
  const [assets, loading] = useAssets();
  console.log(loading, assets.lsp7);

  return (
    <>
      <h1>Assets</h1>
      <Link href="/dashboard/collectibles">Collectibles</Link>
      <Link href="/dashboard/vaults">Vaults</Link>
      {assets.lsp7.map((asset: Lsp7Asset) => {
        return <li key={asset.contractAddress}>{asset.name}</li>;
      })}
    </>
  );
};

export default AssetsPage;
