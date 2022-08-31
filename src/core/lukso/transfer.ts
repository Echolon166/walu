import LSP6KeyManager from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import LSP9Vault from '@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import type Web3 from 'web3';
import type { AbiItem } from 'web3-utils';

import { DEFAULT_GAS } from '@/utils';

// https://docs.lukso.tech/standards/smart-contracts/lsp7-digital-asset/#transfer
export const transferLSP7Asset = async (
  web3: Web3,
  address: string,
  from: string,
  to: string,
  asset: string,
  amount: string,
  controllerAddress?: string,
  force: boolean = true,
  data: string = '0x'
) => {
  const rawAmount = web3.utils.toWei(amount);

  const lsp7DigitalAssetContract = new web3.eth.Contract(
    LSP7DigitalAsset.abi as AbiItem[],
    asset
  );

  // Transfer from main account
  if (address === from) {
    await lsp7DigitalAssetContract.methods
      .transfer(from, to, rawAmount, force, data)
      .send({ from: address });
    // Transfer from vault
  } else {
    const vault = new web3.eth.Contract(LSP9Vault.abi as AbiItem[], from);
    const up = new web3.eth.Contract(
      UniversalProfile.abi as AbiItem[],
      address
    );

    const setTransferPayload = await lsp7DigitalAssetContract.methods
      .transfer(from, to, rawAmount, force, data)
      .encodeABI();

    const executePayloadVault = await vault.methods
      .execute(0, asset, 0, setTransferPayload)
      .encodeABI();

    const executePayloadUp = await up.methods
      .execute(0, from, 0, executePayloadVault)
      .encodeABI();

    const keyManagerAddress = await up.methods.owner().call();
    const km = new web3.eth.Contract(
      LSP6KeyManager.abi as AbiItem[],
      keyManagerAddress
    );

    await km.methods.execute(executePayloadUp).send({
      from: controllerAddress,
      gasLimit: DEFAULT_GAS,
    });
  }
};

// https://docs.lukso.tech/standards/smart-contracts/lsp8-identifiable-digital-asset/#transfer
export const transferLSP8Asset = async (
  web3: Web3,
  address: string,
  from: string,
  to: string,
  asset: string,
  id: string,
  controllerAddress?: string,
  force: boolean = true,
  data: string = '0x'
) => {
  const lSP8IdentifiableDigitalAssetContract = new web3.eth.Contract(
    LSP8IdentifiableDigitalAsset.abi as AbiItem[],
    asset
  );

  // Transfer from main account
  if (address === from) {
    await lSP8IdentifiableDigitalAssetContract.methods
      .transfer(from, to, id, force, data)
      .send({ from: address });
    // Transfer from vault
  } else {
    const vault = new web3.eth.Contract(LSP9Vault.abi as AbiItem[], from);
    const up = new web3.eth.Contract(
      UniversalProfile.abi as AbiItem[],
      address
    );

    const setTransferPayload =
      await lSP8IdentifiableDigitalAssetContract.methods
        .transfer(from, to, id, force, data)
        .encodeABI();

    const executePayloadVault = await vault.methods
      .execute(0, asset, 0, setTransferPayload)
      .encodeABI();

    const executePayloadUp = await up.methods
      .execute(0, from, 0, executePayloadVault)
      .encodeABI();

    const keyManagerAddress = await up.methods.owner().call();
    const km = new web3.eth.Contract(
      LSP6KeyManager.abi as AbiItem[],
      keyManagerAddress
    );

    await km.methods.execute(executePayloadUp).send({
      from: controllerAddress,
      gasLimit: DEFAULT_GAS,
    });
  }
};

export const transferLYX = async (
  web3: Web3,
  address: string,
  from: string,
  to: string,
  amount: string,
  controllerAddress?: string,
  data: string = '0x'
) => {
  const rawAmount = web3.utils.toWei(amount);

  // Transfer from main account
  if (address === from) {
    await web3.eth.sendTransaction({
      from,
      to,
      value: rawAmount,
    });
  } else {
    const vault = new web3.eth.Contract(LSP9Vault.abi as AbiItem[], from);
    const up = new web3.eth.Contract(
      UniversalProfile.abi as AbiItem[],
      address
    );

    const executePayloadVault = await vault.methods
      .execute(0, to, rawAmount, data)
      .encodeABI();

    const executePayloadUp = await up.methods
      .execute(0, from, 0, executePayloadVault)
      .encodeABI();

    const keyManagerAddress = await up.methods.owner().call();
    const km = new web3.eth.Contract(
      LSP6KeyManager.abi as AbiItem[],
      keyManagerAddress
    );

    await km.methods.execute(executePayloadUp).send({
      from: controllerAddress,
      gasLimit: DEFAULT_GAS,
    });
  }
};
