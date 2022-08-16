import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import { useCallback, useEffect, useReducer } from 'react';
import Web3Modal from 'web3modal';

import { DEFAULT_NETWORK_CONFIG } from '@/utils';

import type { Web3Action, Web3ProviderState } from './Web3Provider';
import { web3InitialState, web3Reducer } from './Web3Provider';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        22: DEFAULT_NETWORK_CONFIG.rpc.url,
      },
      bridge: 'https://safe-walletconnect.gnosis.io',
      chainId: 22,
    },
  },
};

let web3Modal: Web3Modal | null;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });
}

export const useWeb3 = () => {
  const [state, dispatch] = useReducer(web3Reducer, web3InitialState);
  let { provider, web3Provider, address, network } = state;

  const connect = useCallback(async () => {
    if (web3Modal) {
      try {
        provider = await web3Modal.connect();
        web3Provider = new ethers.providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        address = await signer.getAddress();
        network = await web3Provider.getNetwork();

        dispatch({
          type: 'SET_WEB3_PROVIDER',
          provider,
          web3Provider,
          address,
          network,
        } as Web3Action);
      } catch (e) {
        console.log('connect error', e);
      }
    } else {
      console.error('No Web3Modal');
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect();
      }

      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      } as Web3Action);
    } else {
      console.error('No Web3Modal');
    }
  }, [provider]);

  // Auto connect to the cached provider.
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // EIP-1193 events
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          dispatch({
            type: 'SET_ADDRESS',
            address: accounts[0],
          } as Web3Action);
        }
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        if (typeof window !== 'undefined') {
          console.log('switched to chain...', _hexChainId);
          window.location.reload();
        } else {
          console.log('window is undefined');
        }
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        console.log('disconnect', error);
        disconnect();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }

    return undefined;
  }, [provider, disconnect]);

  return {
    provider,
    web3Provider,
    address,
    network,
    connect,
    disconnect,
  } as Web3ProviderState;
};
