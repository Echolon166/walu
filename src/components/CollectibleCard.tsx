import classNames from 'classnames';
import Image from 'next/image';

import type { Lsp8Asset } from '@/core/lukso';
import { useVaults } from '@/core/lukso';
import { ipfsLink } from '@/utils';

import { ActionFields } from './ActionFields';
import { Avatar } from './Avatar';
import Disclosure from './Disclosure';

type Props = {
  collectible: Lsp8Asset;
  collectibles: Lsp8Asset[];
  setCollectibles: any;
  vaultAddress?: string;
  className?: string;
};

export default function CollectibleCard({
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
              src={ipfsLink(collectible.lsp8Metadata?.icon?.[0]?.url)}
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
              <Avatar
                image={ipfsLink(collectible.metadata?.icon?.[0]?.url)}
                alt={collectible.name}
                shape="rounded"
              />
            </div>
          </div>
        </div>
      }
      panel={
        <ActionFields
          asset={collectible}
          assets={collectibles}
          setAssets={setCollectibles}
          actions={
            vaultAddress
              ? [
                  {
                    name: 'Transfer to Address',
                    value: 'transferToAddress',
                  },
                  {
                    name: 'Transfer to Vault',
                    value: 'transferToVault',
                  },
                  {
                    name: 'Transfer to Main',
                    value: 'transferToMain',
                  },
                ]
              : [
                  {
                    name: 'Transfer to Address',
                    value: 'transferToAddress',
                  },
                  {
                    name: 'Transfer to Vault',
                    value: 'transferToVault',
                  },
                ]
          }
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
    /* <div
      className={classNames(
        'group relative overflow-hidden rounded-lg transition-transform hover:-translate-y-1',
        className
      )}
    >
      <div className="relative flex aspect-[8/11] w-full justify-center overflow-hidden rounded-lg">
        <Image
          src={ipfsLink(collectible.lsp8Metadata?.icon?.[0]?.url)}
          alt={collectible.name}
          placeholder="blur"
          blurDataURL="/assets/images/lukso_white.svg"
          layout="fill"
          quality={100}
          objectFit="cover"
        />
      </div>
      <div className="absolute top-0 left-0 z-[5] flex h-full w-full flex-col justify-between bg-gradient-to-t from-black p-5 md:p-6">
        <AnchorLink
          href={'https://www.npmjs.com/package/react-use/1'}
          className="absolute top-0 left-0 z-10 h-full w-full"
        />
        <div className="flex justify-between gap-3">
          <div
            className="inline-flex h-8 shrink-0 items-center rounded-2xl bg-white/20 px-4 text-xs font-medium uppercase -tracking-wide text-white
          backdrop-blur-[40px]"
          >
            {collectible.name}
          </div>
          <Avatar
            image={ipfsLink(collectible.metadata?.icon?.[0]?.url)}
            alt={collectible.name}
            shape="rounded"
          />
        </div>
        <div className="block">
          <h2 className="mb-1.5 truncate text-lg font-medium -tracking-wider text-white">
            {collectible.name}
          </h2>
          <AnchorLink
            href={'https://www.npmjs.com/package/react-use'}
            className="relative z-10 mt-3.5 inline-flex items-center rounded-3xl bg-white/20 p-2 backdrop-blur-[40px]"
          >
            <Avatar
              image={'/assets/images/lukso_white.svg'}
              alt={collectible.creators?.[0] ?? ''}
              size="xs"
              width={24}
              height={24}
              className="rounded-full"
            />
            <div className="ml-2 truncate pr-2 text-sm -tracking-wide text-white">
              @{collectible.creators?.[0] ?? ''}
            </div>
          </AnchorLink>
        </div>
      </div>
    </div> */
  );
}
