import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';
import type Web3 from 'web3';
import type { AbiItem } from 'web3-utils';

export const mintLsp7Asset = async (
  web3: Web3,
  address: string,
  asset: string,
  amount: string,
  force: boolean = false,
  data: string = '0x'
) => {
  const rawAmount = web3.utils.toWei(amount);

  const lsp7MintableContract = new web3.eth.Contract(
    LSP7Mintable.abi as AbiItem[],
    asset
  );

  await lsp7MintableContract.methods
    .mint(address, rawAmount, force, data)
    .send({ from: address });
};

export const mintLsp8Asset = async () => {};
