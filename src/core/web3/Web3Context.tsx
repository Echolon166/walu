import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useWeb3 } from './web3Client';
import type { Web3ProviderState } from './web3Provider';
import { web3InitialState } from './web3Provider';

const Web3Context = createContext<Web3ProviderState>(web3InitialState);

type Props = {
  children: ReactNode;
};

export const Web3ContextProvider = ({ children }: Props) => {
  const web3ProviderState = useWeb3();

  return (
    <Web3Context.Provider value={web3ProviderState}>
      {children}
    </Web3Context.Provider>
  );
};

export function useWeb3Context() {
  return useContext(Web3Context);
}
