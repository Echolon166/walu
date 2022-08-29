import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { AnchorLink } from '@/components/AnchorLink';
import { Avatar } from '@/components/Avatar';
import { Check } from '@/components/icons/Check';
import { Copy } from '@/components/icons/Copy';
import ProfileTab from '@/components/ProfileTab';
import { useAssets } from '@/core/lukso';

const data = {
  address: '0xcb9gfhafhvbvcbdhghghgfshgfsh',
  name: 'frozeman',
  description: 'The inventor of ERC725 and ERC20...',
  links: [
    { title: '', url: 'https://twitter.com/feindura' },
    { title: 'lukso.network', url: 'https://lukso.network' },
  ],
  avatar: [
    {
      hashFunction: 'keccak256(bytes)',
      hash: '0x98fe032f81c43426fbcfb21c780c879667a08e2a65e8ae38027d4d61cdfe6f55',
      url: 'ifps://QmPJESHbVkPtSaHntNVY5F6JDLW8v69M2d6khXEYGUMn7N',
      fileType: 'fbx',
    },
  ],
  tempImage: '/assets/images/temp-cover.jpg',
};

const DashboardPage: NextPage = () => {
  const [assets] = useAssets();
  console.log(assets.lsp7, assets.lsp8);
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
  const [_, copyToClipboard] = useCopyToClipboard();
  const handleCopyToClipboard = () => {
    copyToClipboard(data.address);
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  };

  return (
    <>
      {/* Profile Background Image */}
      <div className="relative h-36 w-full overflow-hidden rounded-lg sm:h-44 md:h-64 xl:h-80 2xl:h-96 3xl:h-[448px]">
        <Image
          src={data.tempImage}
          placeholder="blur"
          blurDataURL={data.tempImage}
          layout="fill"
          objectFit="cover"
          alt="Cover Image"
        />
      </div>

      {/* Profile Container */}
      <div className="mx-auto flex w-full shrink-0 flex-col md:px-4 xl:px-6 3xl:max-w-[1700px] 3xl:px-12">
        <div className="md:px-20 xl:px-24 3xl:px-28">
          {/* Profile Image */}
          <Avatar
            size="xl"
            image={data.tempImage}
            alt="User"
            className="z-10 mx-auto -mt-12 dark:border-gray-500 sm:-mt-14 md:mx-0 md:-mt-16 xl:mx-0 3xl:-mt-20"
          />
        </div>
        {/* Profile Info */}
        <div className="flex w-full flex-col pt-4 md:flex-row md:pt-10 lg:flex-row xl:pt-12">
          <div className="shrink-0 border-dashed border-gray-200 dark:border-gray-700 md:w-72 ltr:md:border-r md:ltr:pr-7 rtl:md:border-l md:rtl:pl-7 lg:ltr:pr-10 lg:rtl:pl-10 xl:ltr:pr-14 xl:rtl:pl-14 2xl:w-80 3xl:w-96 3xl:ltr:pr-16 3xl:rtl:pl-16">
            <div className="text-center ltr:md:text-left rtl:md:text-right">
              {/* Name */}
              <h2 className="text-xl font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl">
                {data.name || data.address}
              </h2>

              {/* User Address */}
              <div className="mt-5 inline-flex h-9 items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6">
                <div className="w-32 grow-0 truncate bg-center text-xs text-gray-500 ltr:pl-4 rtl:pr-4 dark:text-gray-300 sm:w-40 sm:text-sm">
                  {data.address}
                </div>
                <div
                  className="flex cursor-pointer items-center px-4 text-gray-500 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  title="Copy Address"
                  onClick={handleCopyToClipboard}
                >
                  {copyButtonStatus ? (
                    <Check className="h-auto w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-auto w-3.5" />
                  )}
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="hidden md:block">
              {/* Description */}
              <div className="border-y border-dashed border-gray-200 py-5 dark:border-gray-700 xl:py-6">
                <div className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-900 dark:text-white">
                  Bio
                </div>
                <div className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400">
                  {data.description}
                </div>
              </div>
              {/* Links */}
              <div className="border-y border-dashed border-gray-200 py-5 dark:border-gray-700 xl:py-6">
                <div className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-900 dark:text-white">
                  Links
                </div>
                {data.links.map((item: any) => (
                  <AnchorLink
                    href={item.url}
                    className="mb-2 flex items-center text-sm tracking-tight text-gray-600 transition last:mb-0 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                    key={item.title + item.url}
                  >
                    {item.title || item.url}
                  </AnchorLink>
                ))}
              </div>
            </div>
          </div>

          <div className="grow pt-6 pb-9 md:-mt-2.5 md:pt-1.5 md:pb-0 md:ltr:pl-7 md:rtl:pr-7 lg:ltr:pl-10 lg:rtl:pr-10 xl:ltr:pl-14 xl:rtl:pr-14 3xl:ltr:pl-16 3xl:rtl:pr-16">
            <ProfileTab assets={assets} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
