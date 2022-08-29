import classNames from 'classnames';
import Image from 'next/image';

import type { Lsp7Asset } from '@/core/lukso';
import { ipfsLink } from '@/utils';

type Props = {
  asset: Lsp7Asset;
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

export default function ListCard({
  asset,
  className = 'p-3 tracking-wider rounded-lg sm:p-4',
  variant = 'small',
}: Props) {
  return (
    <div
      className={classNames(
        'flex items-center justify-between bg-white text-sm font-medium shadow-card dark:bg-light-dark',
        className
      )}
    >
      <div className="flex items-center">
        <div className={classNames('rounded-full', variants[variant])}>
          <Image
            src={ipfsLink(asset.metadata?.icon[0]?.url)}
            alt={asset.name}
            width={handleImageSize(variant)}
            height={handleImageSize(variant)}
          />
        </div>

        <span className="ml-2 block pt-0.5 text-xs font-normal capitalize text-gray-600 dark:text-gray-400">
          {asset.name} ({asset.symbol})
        </span>
      </div>
      <div className="overflow-hidden text-ellipsis pl-2 -tracking-wider">
        {asset.balance}
      </div>
    </div>
  );
}
