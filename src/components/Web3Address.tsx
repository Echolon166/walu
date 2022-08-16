import React from 'react';

import { useWeb3Context } from '@/core/web3';

export function Web3Address() {
  const { address } = useWeb3Context();

  return (
    <div>
      <span>Address: </span>
      <span>{address}</span>
    </div>
  );
}
