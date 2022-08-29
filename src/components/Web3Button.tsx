import { useWeb3Context } from '@/core/web3';

import Button from './Button';

type ConnectProps = {
  connect: (() => Promise<void>) | null;
};

type DisconnectProps = {
  disconnect: (() => Promise<void>) | null;
};

const ConnectButton = ({ connect }: ConnectProps) =>
  connect ? (
    <Button onClick={connect} className="shadow-main hover:shadow-large">
      CONNECT
    </Button>
  ) : (
    <Button className="shadow-main hover:shadow-large">Loading...</Button>
  );

const DisconnectButton = ({ disconnect }: DisconnectProps) =>
  disconnect ? (
    <Button onClick={disconnect} className="shadow-main hover:shadow-large">
      DISCONNECT
    </Button>
  ) : (
    <Button className="shadow-main hover:shadow-large">Loading...</Button>
  );

export function Web3Button() {
  const { web3, connect, disconnect } = useWeb3Context();

  return web3 ? (
    <DisconnectButton disconnect={disconnect} />
  ) : (
    <ConnectButton connect={connect} />
  );
}
