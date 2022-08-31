import { useEffect, useState } from 'react';
import type Web3 from 'web3';

import type { AssetMap, Lsp7Asset, Lsp8Asset } from '@/core/lukso';
import { checkPermissions, createVault } from '@/core/lukso';
import { useWeb3Context } from '@/core/web3';

import AssetCard from './AssetCard';
import Button from './Button';
import CollectibleCard from './CollectibleCard';
import { TabPanel } from './Tab';
import TabParam from './TabParam';
import VaultCard from './VaultCard';

type Props = {
  assets: AssetMap;
  setAssets: any;
  vaults: string[];
  setVaults: any;
};

export default function ProfileTab({
  assets,
  setAssets,
  vaults,
  setVaults,
}: Props) {
  const [isPermissioned, setIsPermissioned] = useState(false);

  const { web3, address, controllerAddress } = useWeb3Context();

  useEffect(() => {
    if (web3) {
      checkPermissions(
        web3 as Web3,
        address as string,
        controllerAddress as string
      ).then((response) => {
        setIsPermissioned(response);
      });
    }
  }, [web3]);

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
        <div className="grid grid-cols-1 gap-3">
          {web3 && !assets.lsp7.length ? (
            <div className="mb-6 flex items-center justify-center rounded-lg bg-gray-100 p-3 text-center text-xs font-medium uppercase tracking-wider text-gray-900 dark:bg-gray-900 dark:text-white sm:h-13 sm:text-sm">
              Empty
            </div>
          ) : (
            <div>
              {assets.lsp7.map((asset: Lsp7Asset) => (
                <AssetCard
                  asset={asset}
                  assets={assets.lsp7}
                  setAssets={setAssets.setLsp7}
                  key={asset.contractAddress}
                />
              ))}
            </div>
          )}
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        {web3 && !assets.lsp8.length ? (
          <div className="mb-6 flex items-center justify-center rounded-lg bg-gray-100 p-3 text-center text-xs font-medium uppercase tracking-wider text-gray-900 dark:bg-gray-900 dark:text-white sm:h-13 sm:text-sm">
            Empty
          </div>
        ) : (
          <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 lg:gap-5 xl:gap-6 3xl:grid-cols-3 4xl:grid-cols-4">
            {assets.lsp8.map((collectible: Lsp8Asset) => (
              <CollectibleCard
                collectible={collectible}
                collectibles={assets.lsp8}
                setCollectibles={setAssets.setLsp8}
                key={`${collectible.contractAddress}/${collectible.id}`}
              />
            ))}
          </div>
        )}
      </TabPanel>
      <TabPanel className="focus:outline-none">
        {web3 && (
          <div>
            {isPermissioned || (
              <sup className="inline-block text-sm text-red-500 ltr:ml-1 rtl:mr-1">
                App controller will ask for required CALL and SET_DATA
                permissions on your first interaction with vaults.
              </sup>
            )}

            {!vaults.length ? (
              <div className="mb-6 flex items-center justify-center rounded-lg bg-gray-100 p-3 text-center text-xs font-medium uppercase tracking-wider text-gray-900 dark:bg-gray-900 dark:text-white sm:h-13 sm:text-sm">
                Empty
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {vaults.map((vault: string) => (
                  <VaultCard vaultAddress={vault} key={vault} />
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-center xs:mt-3">
              <Button
                onClick={async () =>
                  createVault(
                    web3 as Web3,
                    address as string,
                    controllerAddress as string,
                    vaults,
                    setVaults
                  )
                }
                variant="ghost"
              >
                Create New Vault
              </Button>
            </div>
          </div>
        )}
      </TabPanel>
    </TabParam>
  );
}
