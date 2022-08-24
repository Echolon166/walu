import type { NextPage } from 'next';
import Link from 'next/link';

import type { Lsp8Asset } from '@/core/lukso';
import { useAssets } from '@/core/lukso';

const CollectiblesPage: NextPage = () => {
  const [assets, loading] = useAssets();
  console.log(loading, assets.lsp8);

  return (
    <>
      <h1>Collectibles</h1>
      <Link href="/dashboard/assets">Assets</Link>
      <Link href="/dashboard/vaults">Vaults</Link>
      {assets.lsp8.map((asset: Lsp8Asset) => {
        return <li key={asset.contractAddress + asset.id}>{asset.name}</li>;
      })}
    </>
  );
};

export default CollectiblesPage;
