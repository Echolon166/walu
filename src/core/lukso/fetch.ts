import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import { useEffect, useState } from 'react';
import type Web3 from 'web3';
import type { AbiItem } from 'web3-utils';

import { INTERFACE_IDS } from '@/utils/config';

import { useWeb3Context } from '../web3';
import type { AssetMap } from './asset';
import { Lsp7Asset, Lsp8Asset } from './asset';
import {
  getInstance,
  LSP4Schema,
  LSP8IdentifiableDigitalAssetSchema,
  UniversalProfileSchema,
} from './schemas';

async function fetchAssets(web3: Web3, address: string, ownedAssets: string[]) {
  async function fetchAssetMetadata(ownedAsset: string) {
    // Instantiate the asset
    const digitalAsset = getInstance(
      LSP4Schema,
      ownedAsset,
      web3.currentProvider
    );

    // Get the encoded data
    const data = await digitalAsset.fetchData();
    return data;
  }

  async function fetchLSP8Metadata(asset: string, tokenId: string) {
    // Fetch the LSP5 data of the Universal Profile to get its owned assets
    const lsp8Asset = getInstance(
      LSP8IdentifiableDigitalAssetSchema,
      asset,
      web3.currentProvider
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

    const lSP8IdentifiableDigitalAssetContract = new web3.eth.Contract(
      LSP8IdentifiableDigitalAsset.abi as AbiItem[],
      ownedAsset
    );

    const [isLSP7, isLSP8] = await Promise.all([
      lSP8IdentifiableDigitalAssetContract.methods
        .supportsInterface(INTERFACE_IDS.LSP7DigitalAsset)
        .call(),
      lSP8IdentifiableDigitalAssetContract.methods
        .supportsInterface(INTERFACE_IDS.LSP8IdentifiableDigitalAsset)
        .call(),
    ]);

    if (isLSP7) {
      const lsp7DigitalAssetContract = new web3.eth.Contract(
        LSP7DigitalAsset.abi as AbiItem[],
        ownedAsset
      );

      const balance = await lsp7DigitalAssetContract.methods
        .balanceOf(address)
        .call();

      return ['LSP7', ownedAsset, metadata, web3.utils.fromWei(balance)];
    }
    if (isLSP8) {
      const tokenIds = await lSP8IdentifiableDigitalAssetContract.methods
        .tokenIdsOf(address)
        .call();

      return ['LSP8', ownedAsset, metadata, tokenIds];
    }

    console.log('Asset type not found');
    return null;
  }

  const rawAssetCollections = await Promise.all(
    ownedAssets.map((ownedAsset: string) => fetchDetails(ownedAsset))
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

export const useAssets = (): [AssetMap, boolean] => {
  const [lsp7Assets, setLsp7Assets] = useState<Lsp7Asset[]>([]);
  const [lsp8Assets, setLsp8Assets] = useState<Lsp8Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const { web3, address } = useWeb3Context();

  useEffect(() => {
    const fetchProfileAssets = async () => {
      try {
        setLoading(true);

        // Fetch the LSP5 data of the Universal Profile to get its owned assets
        const profile = getInstance(
          UniversalProfileSchema,
          address as string,
          web3?.currentProvider
        );

        const result = await profile.fetchData('LSP5ReceivedAssets[]');
        const ownedAssets = result.value;

        fetchAssets(web3!, address!, ownedAssets as string[]).then(
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
