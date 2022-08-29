import type { Lsp7Asset, Lsp8Asset } from '@/core/lukso';

import CollectibleCard from './CollectibleCard';
import ListCard from './ListCard';
import { TabPanel } from './Tab';
import TabParam from './TabParam';

type Props = {
  assets: any;
};

export default function ProfileTab({ assets }: Props) {
  return (
    <TabParam
      tabMenu={[
        { title: 'Assets', path: 'assets' },
        {
          title: 'Collectibles',
          path: 'collectibles',
        },
        {
          title: 'Vaults',
          path: 'vaults',
        },
      ]}
    >
      <TabPanel className="focus:outline-none">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
          {assets.lsp7.map((asset: Lsp7Asset) => (
            <ListCard asset={asset} key={asset.contractAddress} />
          ))}
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 lg:gap-5 xl:gap-6 3xl:grid-cols-3 4xl:grid-cols-4">
          {assets.lsp8.map((collectible: Lsp8Asset) => (
            <CollectibleCard
              collectible={collectible}
              key={`${collectible.contractAddress}/${collectible.id}`}
            />
          ))}
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none"></TabPanel>
    </TabParam>
  );
}
