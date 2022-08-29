import classNames from 'classnames';
import Image from 'next/image';

import type { Lsp7Asset } from '@/core/lukso';

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
            src={
              asset.metadata.icon[0]?.url.replace(
                'ipfs://',
                'https://ipfs.io/ipfs/'
              ) ?? '/assets/images/lukso_white.svg'
            }
            alt={asset.name}
            width={handleImageSize(variant)}
            height={handleImageSize(variant)}
          />
        </div>

        <div className="ltr:ml-2 rtl:mr-2">
          <span className="block pt-0.5 text-xs font-normal capitalize text-gray-600 dark:text-gray-400">
            {asset.name} ({asset.symbol})
          </span>
        </div>
      </div>
      <div className="overflow-hidden text-ellipsis -tracking-wider ltr:pl-2 rtl:pr-2">
        {asset.balance}
      </div>
    </div>
  );
}
