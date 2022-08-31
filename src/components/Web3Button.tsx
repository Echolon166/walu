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
    <Button
      variant={'ghost'}
      onClick={connect}
      className="shadow-main hover:shadow-large"
    >
      CONNECT
    </Button>
  ) : (
    <Button variant={'ghost'} className="shadow-main hover:shadow-large">
      Loading...
    </Button>
  );

const DisconnectButton = ({ disconnect }: DisconnectProps) =>
  disconnect ? (
    <Button
      variant={'ghost'}
      onClick={disconnect}
      className="shadow-main hover:shadow-large"
    >
      DISCONNECT
    </Button>
  ) : (
    <Button variant={'ghost'} className="shadow-main hover:shadow-large">
      Loading...
    </Button>
  );

export function Web3Button() {
  const { web3, connect, disconnect } = useWeb3Context();

  return web3 ? (
    <DisconnectButton disconnect={disconnect} />
  ) : (
    <ConnectButton connect={connect} />
  );
}
