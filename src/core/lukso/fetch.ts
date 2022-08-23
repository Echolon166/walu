import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import { Contract } from 'ethers';
import { useEffect, useState } from 'react';

import { INTERFACE_IDS } from '@/utils/config';

import { useWeb3Context } from '../web3';
import type { AssetType } from './asset';
import { Asset } from './asset';
import {
  getInstance,
  LSP4Schema,
  LSP8IdentifiableDigitalAssetSchema,
  UniversalProfileSchema,
} from './schemas';

async function fetchAssets(
  ownedAssets: any,
  web3Provider: any,
  address: String | null | undefined
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

  async function fetchLSP8Metadata(asset: any, tokenId: any) {
    // Fetch the LSP5 data of the Universal Profile to get its owned assets
    const lsp8Asset = getInstance(
      '0x03b1F882f65aF390085a4c13715214ab6116b4AE',
      [...LSP4Schema, LSP8IdentifiableDigitalAssetSchema],
      web3Provider?.provider
    );

    const data = await lsp8Asset.fetchData([
      'LSP4TokenName',
      'LSP4TokenSymbol',
      {
        keyName: 'LSP8MetadataJSON:<bytes32>',
        dynamicKeyParts: tokenId,
      },
      'LSP4Metadata',
    ]);

    console.log(asset, data);
  }

  async function fetchDetails(ownedAsset: string) {
    const metadata = await fetchAssetMetadata(ownedAsset);

    const lSP8IdentifiableDigitalAssetContract = new Contract(
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

    let assetType: AssetType = null;

    if (isLSP7) {
      assetType = 'LSP7';

      return [ownedAsset, metadata, assetType, null];
    }
    if (isLSP8) {
      assetType = 'LSP8';

      const tokenIds = await lSP8IdentifiableDigitalAssetContract.tokenIdsOf(
        address
      );

      return [ownedAsset, metadata, assetType, tokenIds, 1];
    }

    console.log('Asset type not found');
    return null;
  }

  const rawAssetCollections = await Promise.all(
    ownedAssets.map((ownedAsset: any) => fetchDetails(ownedAsset))
  );

  const rawAssets: any[] = [];

  rawAssetCollections.forEach((collection: any) => {
    if (collection[2] === 'LSP8') {
      collection[3].forEach((tokenId: any) => {
        fetchLSP8Metadata(collection[0], tokenId);
        rawAssets.push([
          collection[0],
          collection[1],
          collection[2],
          tokenId,
          collection[4],
        ]);
      });
    } else {
      rawAssets.push(collection);
    }
  });

  const assets = rawAssets.map((rawAsset) => {
    return new Asset(rawAsset);
  });

  return assets;
}

export const useAssets = () => {
  const [assets, setAssets] = useState<any>([]);
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

        fetchAssets(ownedAssets, web3Provider, address).then((mappedAssets) => {
          setAssets(mappedAssets);
          setLoading(false);
        });
      } catch (e) {
        console.log('error', e);
      }
    };

    fetchProfileAssets();
  }, [address]);

  return [assets, loading];
};
