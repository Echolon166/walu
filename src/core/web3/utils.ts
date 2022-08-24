import { ethers } from 'ethers';

// Get LYX balance of the account
export const getAccountBalance = async (web3Provider: any, address: string) => {
  const balance = await web3Provider.getBalance(address);

  return ethers.utils.formatEther(balance);
};
