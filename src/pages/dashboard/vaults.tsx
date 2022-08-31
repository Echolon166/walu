import type { NextPage } from 'next';
import Link from 'next/link';

import { createVault, useVaults } from '@/core/lukso';
import { useWeb3Context } from '@/core/web3';

const VaultsPage: NextPage = () => {
  const { web3, address, controllerAddress } = useWeb3Context();
  const [vaults, setVaults] = useVaults();

  return (
    <>
      <h1>Vaults</h1>
      <Link href="/dashboard/assets">Assets</Link>
      <Link href="/dashboard/collectibles">Collectibles</Link>
      {vaults.map((vault: string) => {
        return <li key={vault}>{vault}</li>;
      })}
      <button
        onClick={async () => {
          const newVault = await createVault(
            web3!,
            address!,
            controllerAddress!,
            vaults,
            setVaults
          );

          setVaults([...vaults, newVault]);
        }}
      >
        Create Vault
      </button>
    </>
  );
};

export default VaultsPage;
