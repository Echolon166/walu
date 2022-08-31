import classNames from 'classnames';
import Image from 'next/image';

import { useVaults } from '@/core/lukso';
import type { Asset } from '@/core/lukso/types';
import { ipfsLink } from '@/utils';

import { ActionFields } from './ActionFields';
import Disclosure from './Disclosure';

type Props = {
  collectible: Asset;
  collectibles: Asset[];
  setCollectibles: any;
  vaultAddress?: string;
  className?: string;
};

export default function IssuedCollectibleCard({
  collectible,
  collectibles,
  setCollectibles,
  vaultAddress,
  className = '',
}: Props) {
  const [vaults] = useVaults();

  return (
    <Disclosure
      button={
        <div className="group relative overflow-hidden rounded-lg transition-transform hover:-translate-y-1">
          <div className="relative flex aspect-[8/11] w-full justify-center overflow-hidden rounded-lg">
            <Image
              src={ipfsLink(collectible.metadata?.icon?.[0]?.url)}
              alt={collectible.name}
              placeholder="blur"
              blurDataURL="/assets/images/lukso_white.svg"
              layout="fill"
              quality={100}
              objectFit="cover"
            />
          </div>
          <div className="absolute top-0 left-0 z-[5] flex h-full w-full flex-col justify-between bg-gradient-to-t from-black p-5 md:p-6">
            <div className="flex justify-between gap-3">
              <div className="block">
                <h2 className="mb-1.5 truncate text-lg font-medium -tracking-wider text-white">
                  {collectible.name}
                </h2>
              </div>
            </div>
          </div>
        </div>
      }
      panel={
        <ActionFields
          asset={collectible}
          assets={collectibles}
          setAssets={setCollectibles}
          actions={[
            {
              name: 'Mint',
              value: 'mint',
            },
          ]}
          vaults={vaults
            .filter((vault) => vault !== vaultAddress)
            .map((vault) => {
              return {
                name: vault,
                value: vault,
              };
            })}
          vaultAddress={vaultAddress}
        />
      }
      mainClassName={classNames(
        'bg-white text-sm font-medium shadow-card dark:bg-light-dark hover:shadow-md',
        className
      )}
      buttonClassName={' cursor-pointer items-center'}
      panelClassName={'pt-2 sm:px-4 sm:pt-4'}
    />
  );
}
