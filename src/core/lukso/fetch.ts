import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { INTERFACE_IDS } from '@/utils/config';

import { useWeb3Context } from '../web3';
import { Lsp7Asset, Lsp8Asset } from './asset';
import {
  getInstance,
  LSP4Schema,
  LSP8IdentifiableDigitalAssetSchema,
  UniversalProfileSchema,
} from './schemas';

async function fetchAssets(
  ownedAssets: any,
  web3Provider: any,
  address: string | null | undefined
) {
  async function fetchAssetMetadata(ownedAsset: string) {
    // Instantiate the asset
    const digitalAsset = getInstance(
      ownedAsset,
      LSP4Schema,
      web3Provider?.provider
    );

    // Get the encoded data
    const data = await digitalAsset.fetchData();
    return data;
  }

  async function fetchLSP8Metadata(asset: string, tokenId: string) {
    // Fetch the LSP5 data of the Universal Profile to get its owned assets
    const lsp8Asset = getInstance(
      asset,
      LSP8IdentifiableDigitalAssetSchema,
      web3Provider?.provider
    );

    const data = await lsp8Asset.fetchData([
      {
        keyName: 'LSP8MetadataJSON:<bytes32>',
        dynamicKeyParts: tokenId,
      },
    ]);

    return data;
  }

  async function fetchDetails(ownedAsset: string) {
    const metadata = await fetchAssetMetadata(ownedAsset);

    const lSP8IdentifiableDigitalAssetContract = new ethers.Contract(
      ownedAsset,
      LSP8IdentifiableDigitalAsset.abi,
      web3Provider.getSigner()
    );

    const [isLSP7, isLSP8] = await Promise.all([
      lSP8IdentifiableDigitalAssetContract.supportsInterface(
        INTERFACE_IDS.LSP7DigitalAsset
      ),
      lSP8IdentifiableDigitalAssetContract.supportsInterface(
        INTERFACE_IDS.LSP8IdentifiableDigitalAsset
      ),
    ]);

    if (isLSP7) {
      const lsp7DigitalAssetContract = new ethers.Contract(
        ownedAsset,
        LSP7DigitalAsset.abi,
        web3Provider.getSigner()
      );

      const balance = await lsp7DigitalAssetContract.balanceOf(address);

      return ['LSP7', ownedAsset, metadata, ethers.utils.formatEther(balance)];
    }
    if (isLSP8) {
      const tokenIds = await lSP8IdentifiableDigitalAssetContract.tokenIdsOf(
        address
      );

      return ['LSP8', ownedAsset, metadata, tokenIds];
    }

    console.log('Asset type not found');
    return null;
  }

  const rawAssetCollections = await Promise.all(
    ownedAssets.map((ownedAsset: any) => fetchDetails(ownedAsset))
  );

  const lsp7Assets: Lsp7Asset[] = [];
  const lsp8Assets: Lsp8Asset[] = [];

  await Promise.all(
    rawAssetCollections.map(async (collection: any) => {
      if (collection[0] === 'LSP8') {
        await Promise.all(
          collection[3].map(async (tokenId: string) => {
            const lsp8Metadata = await fetchLSP8Metadata(
              collection[1],
              tokenId
            );
            lsp8Assets.push(
              new Lsp8Asset(collection[1], collection[2], tokenId, lsp8Metadata)
            );
          })
        );
      } else {
        lsp7Assets.push(
          new Lsp7Asset(collection[1], collection[2], collection[3])
        );
      }
    })
  );

  return [lsp7Assets, lsp8Assets];
}

export const useAssets = (): any => {
  const [lsp7Assets, setLsp7Assets] = useState<Lsp7Asset[]>([]);
  const [lsp8Assets, setLsp8Assets] = useState<Lsp8Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const { web3Provider, address } = useWeb3Context();

  useEffect(() => {
    const fetchProfileAssets = async () => {
      try {
        setLoading(true);

        // Fetch the LSP5 data of the Universal Profile to get its owned assets
        const profile = getInstance(
          address as string,
          UniversalProfileSchema,
          web3Provider?.provider
        );

        const result = await profile.fetchData('LSP5ReceivedAssets[]');
        const ownedAssets = result.value;

        fetchAssets(ownedAssets, web3Provider, address).then(
          ([mappedLsp7Assets, mappedLsp8Assets]) => {
            setLsp7Assets(mappedLsp7Assets as Lsp7Asset[]);
            setLsp8Assets(mappedLsp8Assets as Lsp8Asset[]);
            setLoading(false);
          }
        );
      } catch (e) {
        console.log('error', e);
      }
    };

    fetchProfileAssets();
  }, [address]);

  return [{ lsp7: lsp7Assets, lsp8: lsp8Assets }, loading];
};
