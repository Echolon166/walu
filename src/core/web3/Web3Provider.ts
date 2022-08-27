import type Web3 from 'web3';

export type Web3ProviderState = {
  provider: any;
  web3: Web3 | null | undefined;
  address: string | null | undefined;
  controllerAddress: string | null | undefined;
  network: number | null | undefined;
  connect: (() => Promise<void>) | null;
  disconnect: (() => Promise<void>) | null;
};

export const web3InitialState: Web3ProviderState = {
  provider: null,
  web3: null,
  address: null,
  controllerAddress: null,
  network: null,
  connect: null,
  disconnect: null,
};

export type Web3Action =
  | {
      type: 'SET_WEB3_PROVIDER';
      provider?: Web3ProviderState['provider'];
      web3?: Web3ProviderState['web3'];
      address?: Web3ProviderState['address'];
      controllerAddress?: Web3ProviderState['controllerAddress'];
      network?: Web3ProviderState['network'];
    }
  | {
      type: 'SET_ADDRESS';
      address?: Web3ProviderState['address'];
    }
  | {
      type: 'SET_NETWORK';
      network?: Web3ProviderState['network'];
    }
  | {
      type: 'RESET_WEB3_PROVIDER';
    };

export function web3Reducer(
  state: Web3ProviderState,
  action: Web3Action
): Web3ProviderState {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      console.log('SET_WEB3_PROVIDER', action);
      return {
        ...state,
        provider: action.provider,
        web3: action.web3,
        address: action.address,
        controllerAddress: action.controllerAddress,
        network: action.network,
      };
    case 'SET_ADDRESS':
      console.log('SET_ADDRESS', action);
      return {
        ...state,
        address: action.address,
      };
    case 'SET_NETWORK':
      console.log('SET_NETWORK', action);
      return {
        ...state,
        network: action.network,
      };
    case 'RESET_WEB3_PROVIDER':
      console.log('RESET_WEB3_PROVIDER', action);
      return web3InitialState;
    default:
      throw new Error();
  }
}
