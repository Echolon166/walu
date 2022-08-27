import type Web3 from 'web3';

// Get LYX balance of the account
export const getAccountBalance = async (web3: Web3, address: string) => {
  const balance = await web3.eth.getBalance(address);

  return web3.utils.fromWei(balance);
};
