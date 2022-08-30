import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';

import type { Lsp7Asset, Lsp8Asset } from '@/core/lukso';
import { useAssets } from '@/core/lukso';

import AssetCard from './AssetCard';
import CollectibleCard from './CollectibleCard';

type Props = {
  vaultAddress: string;
  className?: string;
};

export default function VaultCard({
  vaultAddress,
  className = 'p-3 tracking-wider rounded-lg sm:p-4',
}: Props) {
  const [assets] = useAssets(vaultAddress);
  console.log(vaultAddress, assets);

  return (
    <div
      className={classNames(
        'bg-white text-sm font-medium shadow-card dark:bg-light-dark',
        className
      )}
    >
      <Disclosure>
        <Disclosure.Button className="py-2">{vaultAddress}</Disclosure.Button>
        <Disclosure.Panel className="text-gray-500">
          <div className="grid grid-cols-1 gap-3">
            {assets.lsp7.map((asset: Lsp7Asset) => (
              <AssetCard asset={asset} key={asset.contractAddress} />
            ))}
            <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:gap-6 3xl:grid-cols-4 4xl:grid-cols-6">
              {assets.lsp8.map((collectible: Lsp8Asset) => (
                <CollectibleCard
                  collectible={collectible}
                  key={`${collectible.contractAddress}/${collectible.id}`}
                />
              ))}
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
}
