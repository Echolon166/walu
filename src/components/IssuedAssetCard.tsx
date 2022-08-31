import classNames from 'classnames';
import Image from 'next/image';

import type { Asset } from '@/core/lukso/types';
import { ipfsLink } from '@/utils';

import { ActionFields } from './ActionFields';
import Disclosure from './Disclosure';
import { ChevronDown } from './icons/ChevronDown';

type Props = {
  asset: Asset;
  assets: Asset[];
  setAssets: any;
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
  className = 'p-3 tracking-wider rounded-lg sm:p-4',
  variant = 'small',
}: Props) {
  return (
    <Disclosure
      button={
        <div className="flex items-center ">
          <div className="flex basis-11/12 items-center ">
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
          actions={[
            {
              name: 'Mint',
              value: 'mint',
            },
          ]}
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
