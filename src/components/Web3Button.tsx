import { useWeb3Context } from '@/context';

type ConnectProps = {
  connect: (() => Promise<void>) | null;
};

type DisconnectProps = {
  disconnect: (() => Promise<void>) | null;
};

const ConnectButton = ({ connect }: ConnectProps) =>
  connect ? (
    <button onClick={connect}>Connect</button>
  ) : (
    <button>Loading...</button>
  );

const DisconnectButton = ({ disconnect }: DisconnectProps) =>
  disconnect ? (
    <button onClick={disconnect}>Disconnect</button>
  ) : (
    <button>Loading...</button>
  );

export function Web3Button() {
  const { web3Provider, connect, disconnect } = useWeb3Context();

  return web3Provider ? (
    <DisconnectButton disconnect={disconnect} />
  ) : (
    <ConnectButton connect={connect} />
  );
}
