import LSP1UniversalReceiverDelegateVault from '@lukso/lsp-smart-contracts/artifacts/LSP1UniversalReceiverDelegateVault.json';
import LSP6KeyManager from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import LSP9Vault from '@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import constants from '@lukso/lsp-smart-contracts/constants';
import { useEffect, useState } from 'react';
import type Web3 from 'web3';
import type { AbiItem } from 'web3-utils';

import { useWeb3Context } from '../web3';
import { getPermissions } from './permission';
import { getInstance, LSP10ReceivedVaultsSchema } from './schemas';

export const createVault = async (
  web3: Web3,
  address: string,
  controllerAddress: string,
  ownedVaults: string[]
) => {
  await getPermissions(web3, address, controllerAddress);

  let vaultAddress: string | undefined = '';
  let URDAddress: string | undefined = '';

  // Deploy LSP9Vault contract

  const vaultDeployer = new web3.eth.Contract(LSP9Vault.abi as AbiItem[]);
  await vaultDeployer
    .deploy({
      data: LSP9Vault.bytecode,
      arguments: [address],
    })
    .send({
      from: address,
      gas: 5_000_000,
      gasPrice: '1000000000',
    })
    .on('receipt', async (transactionReceipt) => {
      vaultAddress = transactionReceipt.contractAddress;
    });

  console.log('Vault deployed: ', vaultAddress);

  // Deploy Universal Receiver Delegate (URD) contract

  const URDVaultDeployer = new web3.eth.Contract(
    LSP1UniversalReceiverDelegateVault.abi as AbiItem[]
  );
  await URDVaultDeployer.deploy({
    data: LSP1UniversalReceiverDelegateVault.bytecode,
  })
    .send({
      from: address,
      gas: 5_000_000,
      gasPrice: '1000000000',
    })
    .on('receipt', async (transactionReceipt) => {
      URDAddress = transactionReceipt.contractAddress;
    });

  console.log('Vault URD deployed: ', URDAddress);

  const URD_DATA_KEY = constants.ERC725YKeys.LSP0.LSP1UniversalReceiverDelegate;

  // Set the URD for the vault

  const vault = new web3.eth.Contract(LSP9Vault.abi as AbiItem[], vaultAddress);
  const up = new web3.eth.Contract(UniversalProfile.abi as AbiItem[], address);

  const setDataPayload = await vault.methods['setData(bytes32,bytes)'](
    URD_DATA_KEY,
    URDAddress
  ).encodeABI();

  const executeVaultSetURD = await up.methods
    .execute(0, vaultAddress, 0, setDataPayload)
    .encodeABI();

  const keyManagerAddress = await up.methods.owner().call();
  const km = new web3.eth.Contract(
    LSP6KeyManager.abi as AbiItem[],
    keyManagerAddress
  );

  await km.methods.execute(executeVaultSetURD).send({
    from: controllerAddress,
    gasLimit: 600_000,
  });

  console.log('Set URD for vault');

  // Add vault to the profile

  const erc725 = getInstance(
    LSP10ReceivedVaultsSchema,
    address,
    web3.currentProvider
  );

  const encodedData = erc725.encodeData([
    {
      keyName: 'LSP10Vaults[]',
      value: [...ownedVaults, vaultAddress],
    },
  ]);

  const executeProfileAddVault = await up.methods['setData(bytes32[],bytes[])'](
    encodedData.keys,
    encodedData.values
  ).encodeABI();

  await km.methods.execute(executeProfileAddVault).send({
    from: controllerAddress,
    gasLimit: 600_000,
  });

  console.log('Added vault to the profile');

  return vaultAddress;
};

export const useVaults = (): [string[], any, boolean] => {
  const [vaults, setVaults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { web3, address } = useWeb3Context();

  useEffect(() => {
    const fetchProfileVaults = async () => {
      try {
        setLoading(true);

        // Fetch the LSP5 data of the Universal Profile to get its owned assets
        const profile = getInstance(
          LSP10ReceivedVaultsSchema,
          address as string,
          web3?.currentProvider
        );

        const result = await profile.fetchData('LSP10Vaults[]');
        const ownedVaults = result.value;

        setVaults(ownedVaults as string[]);
      } catch (e) {
        console.log('error', e);
      }
    };

    fetchProfileVaults();
  }, [address]);

  return [vaults, setVaults, loading];
};
