import { createRef, useState } from 'react';
import type Web3 from 'web3';

import {
  Lsp7Asset,
  Lsp8Asset,
  transferLSP7Asset,
  transferLSP8Asset,
  transferLYX,
} from '@/core/lukso';
import { useWeb3Context } from '@/core/web3';
import { LYX_ADDRESS } from '@/utils/config';

import Button from './Button';
import { Input } from './Input';
import type { ListboxOption } from './Listbox';
import Listbox from './Listbox';

type ActionFieldsProps = {
  asset: Lsp7Asset | Lsp8Asset;
  assets: any;
  setAssets: any;
  actions: ListboxOption[];
  vaults?: ListboxOption[];
  vaultAddress?: string;
};

async function executeActions(
  web3: Web3,
  accountAddress: string,
  asset: Lsp7Asset | Lsp8Asset,
  assets: any,
  setAssets: any,
  actionType: string,
  parameters: any[],
  controllerAddress?: string,
  vaultAddress?: string
) {
  const [transferToAddressParams, transferToVaultParams, transferToMainParams] =
    parameters;

  let toAddress = '';
  let amount = '';

  if (actionType === 'transferToAddress') {
    [toAddress, amount] = transferToAddressParams;
  } else if (actionType === 'transferToVault') {
    [toAddress, amount] = transferToVaultParams;
  } else if (actionType === 'transferToMain') {
    [toAddress, amount] = transferToMainParams;
  }

  if (asset instanceof Lsp7Asset) {
    if (asset.contractAddress === LYX_ADDRESS) {
      await transferLYX(
        web3,
        accountAddress,
        vaultAddress || accountAddress,
        toAddress,
        amount,
        controllerAddress
      );
    } else {
      await transferLSP7Asset(
        web3,
        accountAddress,
        vaultAddress || accountAddress,
        toAddress,
        asset.contractAddress,
        amount,
        controllerAddress
      );
    }

    const index = assets.indexOf(asset);
    const newAssets = assets.slice(0);
    const newAsset = asset;

    newAsset.balance = (
      parseFloat(asset.balance) - parseFloat(amount)
    ).toString();
    newAssets[index] = asset;

    setAssets(newAssets);
  } else if (asset instanceof Lsp8Asset) {
    await transferLSP8Asset(
      web3,
      accountAddress,
      vaultAddress || accountAddress,
      toAddress,
      asset.contractAddress,
      asset.id,
      controllerAddress
    );

    const newAssets = assets.filter(
      (filterAsset: Lsp8Asset) => filterAsset !== asset
    );

    setAssets(newAssets);
  }
}

export function ActionFields({
  asset,
  assets,
  setAssets,
  actions,
  vaults = [{ name: '', value: '' }],
  vaultAddress,
}: ActionFieldsProps) {
  const [actionType, setActionType] = useState<ListboxOption>(
    actions[0] || { name: '', value: '' }
  );
  const [vault, setVault] = useState<ListboxOption>(
    vaults[0] || { name: '', value: '' }
  );

  const { web3, address, controllerAddress } = useWeb3Context();

  const addressRef = createRef<HTMLInputElement>();
  const amountRef = createRef<HTMLInputElement>();

  return (
    <div>
      <div className="group mb-4 rounded-md bg-gray-100/90 p-5 pt-3 dark:bg-dark/60 xs:p-6 xs:pb-8">
        <div className="-mr-2 mb-3 flex items-center justify-between">
          <h3 className="text-base font-medium dark:text-gray-100">Action</h3>
        </div>
        <>
          <Listbox
            className="w-full sm:w-80"
            options={actions}
            selectedOption={actionType}
            onChange={setActionType}
          />
          {actionType.value === 'transferToAddress' && (
            <div>
              <Input
                label="Address"
                className="mt-4 xs:ml-6 sm:ml-12"
                useUppercaseLabel={false}
                placeholder="0x..."
                ref={addressRef}
              />
              {asset instanceof Lsp7Asset && (
                <Input
                  label="Amount"
                  className="mt-4 xs:ml-6 sm:ml-12"
                  useUppercaseLabel={false}
                  placeholder="0"
                  ref={amountRef}
                />
              )}
            </div>
          )}
          {actionType.value === 'transferToVault' && (
            <div>
              <div className="ml-1 mt-4 inline-block w-full text-[13px] xs:ml-6 sm:ml-12 sm:w-80">
                <span className="block text-xs font-medium tracking-widest dark:text-gray-100 sm:text-sm">
                  Address
                </span>
              </div>
              <Listbox
                className="mt-4 w-full xs:ml-6 sm:ml-12 sm:w-80"
                options={vaults}
                selectedOption={vault}
                onChange={setVault}
              />
              {asset instanceof Lsp7Asset && (
                <Input
                  label="Amount"
                  className="mt-4 xs:ml-6 sm:ml-12"
                  useUppercaseLabel={false}
                  placeholder="0"
                  ref={amountRef}
                />
              )}
            </div>
          )}
          {actionType.value === 'transferToMain' && (
            <div className="grid">
              <div className="ml-1 mt-4 inline-block w-full text-[13px] xs:ml-6 sm:ml-12 sm:w-80">
                <span className="block text-xs font-medium tracking-widest dark:text-gray-100 sm:text-sm">
                  Address
                </span>
              </div>
              <div className="ml-1 mt-4 inline-block w-full text-[13px] xs:ml-6 sm:ml-12 sm:w-80">
                <span className="block text-xs font-medium tracking-widest dark:text-gray-100 sm:text-sm">
                  {address}
                </span>
              </div>
              {asset instanceof Lsp7Asset && (
                <Input
                  label="Amount"
                  className="mt-4 xs:ml-6 sm:ml-12"
                  useUppercaseLabel={false}
                  placeholder="0"
                  ref={amountRef}
                />
              )}
            </div>
          )}
        </>
      </div>
      <div className="mt-2 flex justify-end xs:mt-3">
        <Button
          onClick={async () =>
            executeActions(
              web3 as Web3,
              address as string,
              asset,
              assets,
              setAssets,
              actionType.value,
              [
                [addressRef.current?.value, amountRef.current?.value],
                [vault.value, amountRef.current?.value],
                [address, amountRef.current?.value],
              ],
              controllerAddress as string,
              vaultAddress
            )
          }
          variant="ghost"
        >
          Execute
        </Button>
      </div>
    </div>
  );
}
