import classNames from 'classnames';

import type { Lsp7Asset, Lsp8Asset } from '@/core/lukso';
import { useAssets } from '@/core/lukso';

import AssetCard from './AssetCard';
import CollectibleCard from './CollectibleCard';
import Disclosure from './Disclosure';
import { ChevronDown } from './icons/ChevronDown';

type Props = {
  vaultAddress: string;
  className?: string;
};

export default function VaultCard({ vaultAddress, className = '' }: Props) {
  const [assets, setAssets] = useAssets(vaultAddress);
  console.log(vaultAddress, assets);

  return (
    <Disclosure
      button={
        <div className="flex items-center px-4 sm:col-auto sm:px-8">
          <div className="flex basis-11/12">
            <h1>{vaultAddress}</h1>
          </div>
          <div className="flex basis-1/12 justify-end">
            <ChevronDown />
          </div>
        </div>
      }
      panel={
        !assets.lsp7.length && !assets.lsp8.length ? (
          <div className="mb-6 flex items-center justify-center rounded-lg bg-gray-100 p-3 text-center text-xs font-medium uppercase tracking-wider text-gray-900 dark:bg-gray-900 dark:text-white sm:h-13 sm:text-sm">
            Empty
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {assets.lsp7.map((asset: Lsp7Asset) => (
              <AssetCard
                asset={asset}
                assets={assets.lsp7}
                setAssets={setAssets.setLsp7}
                vaultAddress={vaultAddress}
                key={asset.contractAddress}
              />
            ))}
            <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 lg:gap-5 xl:gap-6 3xl:grid-cols-3 4xl:grid-cols-4">
              {assets.lsp8.map((collectible: Lsp8Asset) => (
                <CollectibleCard
                  collectible={collectible}
                  collectibles={assets.lsp8}
                  setCollectibles={setAssets.setLsp8}
                  vaultAddress={vaultAddress}
                  key={`${collectible.contractAddress}/${collectible.id}`}
                />
              ))}
            </div>
          </div>
        )
      }
      mainClassName={classNames(
        'relative mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-lg dark:bg-light-dar',
        className
      )}
      buttonClassName={
        'relative grid h-auto cursor-pointer items-center gap-3 py-4 sm:h-20 sm:gap-6 sm:py-0'
      }
      panelClassName={'p-4 sm:px-8 sm:py-6'}
    />
  );
}
