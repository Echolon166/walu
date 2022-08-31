import classNames from 'classnames';
import Image from 'next/image';

import type { Lsp7Asset } from '@/core/lukso';
import { useVaults } from '@/core/lukso';
import { ipfsLink } from '@/utils';

import { ActionFields } from './ActionFields';
import Disclosure from './Disclosure';
import { ChevronDown } from './icons/ChevronDown';

type Props = {
  asset: Lsp7Asset;
  assets: Lsp7Asset[];
  setAssets: any;
  vaultAddress?: string;
  className?: string;
  variant?: 'small' | 'medium' | 'large';
};

const variants = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-8 h-8 sm:w-10 sm:h-10',
};

function handleImageSize(variant: string) {
  let size: number = 0;
  if (variant === 'large') {
    size = 40;
  } else if (variant === 'medium') {
    size = 32;
  } else {
    size = 24;
  }

  return size;
}

export default function AssetCard({
  asset,
  assets,
  setAssets,
  vaultAddress,
  className = 'p-3 tracking-wider rounded-lg sm:p-4',
  variant = 'small',
}: Props) {
  const [vaults] = useVaults();

  return (
    <Disclosure
      button={
        <div className="flex items-center ">
          <div className="flex basis-6/12 items-center ">
            <div className={classNames('rounded-full', variants[variant])}>
              <Image
                src={ipfsLink(asset.metadata?.icon?.[0]?.url)}
                alt={asset.name}
                width={handleImageSize(variant)}
                height={handleImageSize(variant)}
              />
            </div>

            <span className="ml-2 pt-0.5">
              {asset.name} ({asset.symbol})
            </span>
          </div>
          <div className="flex basis-5/12 justify-end overflow-hidden text-ellipsis -tracking-wider">
            {parseFloat(asset.balance)
              .toFixed(8)
              .replace(/[.,]00000000$/, '')
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </div>
          <div className="flex basis-1/12 justify-end">
            <ChevronDown />
          </div>
        </div>
      }
      panel={
        <ActionFields
          asset={asset}
          assets={assets}
          setAssets={setAssets}
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
      buttonClassName={
        'relative grid h-auto cursor-pointer items-center gap-3 py-4 sm:h-10 sm:gap-6 sm:py-0'
      }
      panelClassName={'pt-2 sm:px-4 sm:pt-4'}
    />
  );
}
