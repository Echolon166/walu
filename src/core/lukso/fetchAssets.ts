import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts/constants';
import { useEffect, useState } from 'react';
import type Web3 from 'web3';
import type { AbiItem } from 'web3-utils';

import { LYX_ADDRESS } from '@/utils/config';

import { getAccountBalance, useWeb3Context } from '../web3';
import {
  getInstance,
  LSP4Schema,
  LSP8IdentifiableDigitalAssetSchema,
  UniversalProfileSchema,
} from './schemas';
import type { AssetMap } from './types';
import { Asset, Lsp7Asset, Lsp8Asset } from './types';
import type { CreatedAssetMap } from './types/asset';

async function fetchAssetMetadata(web3: Web3, ownedAsset: string) {
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

async function fetchLSP8Metadata(web3: Web3, asset: string, tokenId: string) {
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

async function fetchDetails(web3: Web3, address: string, ownedAsset: string) {
  const metadata = await fetchAssetMetadata(web3, ownedAsset);

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

async function getLYXAsLsp7(web3: Web3, address: string) {
  const balance = await getAccountBalance(web3, address!);

  const lyxAsLsp7Asset = new Lsp7Asset(
    LYX_ADDRESS,
    [
      '',
      { value: 'Lukso' },
      { value: 'LYX' },
      {
        value: {
          LSP4Metadata: {
            assets: [],
            description: 'Lukso Coin',
            icon: [
              {
                hash: '0x9037e140306b26cf4caefd068ffb05d53ee6be94a895d5ef946d17d9417360c5',
                hashFunction: 'keccak256(bytes)',
                height: 200,
                url: 'ipfs://QmSuiYJre6n7Ar2cKCYWSF6zfkbw3YVaCPrVeq4Sd4323E',
                width: 200,
              },
              {
                hash: '0xc3c9223718bae55c9f2292d0a093e25a069f8cce71db3807bf211214bb2eab5c',
                hashFunction: 'keccak256(bytes)',
                height: 32,
                url: 'ipfs://QmVYxcnRc99dgV1Y9GEeuE4xYLC23PqJKqotcjPGcpot5c',
                width: 32,
              },
            ],
            images: [],
            links: [{ title: 'Lukso Website', url: 'https://lukso.network/' }],
          },
        },
      },
      { value: {} },
    ],
    balance
  );

  return lyxAsLsp7Asset;
}

async function fetchAssets(web3: Web3, address: string, ownedAssets: string[]) {
  const rawAssetCollections = await Promise.all(
    ownedAssets.map((ownedAsset: string) =>
      fetchDetails(web3, address, ownedAsset)
    )
  );

  const lsp7Assets: Lsp7Asset[] = [];
  const lsp8Assets: Lsp8Asset[] = [];

  await Promise.all(
    rawAssetCollections.map(async (collection: any) => {
      if (collection[0] === 'LSP8') {
        await Promise.all(
          collection[3].map(async (tokenId: string) => {
            const lsp8Metadata = await fetchLSP8Metadata(
              web3,
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

  const lyx = await getLYXAsLsp7(web3, address);
  lsp7Assets.unshift(lyx);

  return [lsp7Assets, lsp8Assets];
}

async function fetchCreations(
  web3: Web3,
  address: string,
  createdAssets: string[]
) {
  const rawAssetCollections = await Promise.all(
    createdAssets.map((ownedAsset: string) =>
      fetchDetails(web3, address, ownedAsset)
    )
  );

  const createdLsp7Assets: Asset[] = [];
  const createdLsp8Assets: Asset[] = [];

  rawAssetCollections.map(async (collection: any) => {
    if (collection[0] === 'LSP8') {
      createdLsp8Assets.push(new Asset(collection[1], collection[2]));
    } else {
      createdLsp7Assets.push(new Asset(collection[1], collection[2]));
    }
  });

  return [createdLsp7Assets, createdLsp8Assets];
}

export const useAssets = (
  address: string
): [AssetMap, any, CreatedAssetMap, any] => {
  const [lsp7Assets, setLsp7Assets] = useState<Lsp7Asset[]>([]);
  const [lsp8Assets, setLsp8Assets] = useState<Lsp8Asset[]>([]);
  const [createdLsp7Assets, setCreatedLsp7Assets] = useState<Asset[]>([]);
  const [createdLsp8Assets, setCreatedLsp8Assets] = useState<Asset[]>([]);

  const { web3 } = useWeb3Context();

  useEffect(() => {
    const fetchProfileAssets = async () => {
      try {
        // Fetch the LSP5 data of the Universal Profile to get its owned assets
        const profile = getInstance(
          UniversalProfileSchema,
          address,
          web3?.currentProvider
        );

        const lsp5Result = await profile.fetchData('LSP5ReceivedAssets[]');
        const ownedAssets = lsp5Result.value;

        fetchAssets(web3!, address!, ownedAssets as string[]).then(
          ([mappedLsp7Assets, mappedLsp8Assets]) => {
            setLsp7Assets(mappedLsp7Assets as Lsp7Asset[]);
            setLsp8Assets(mappedLsp8Assets as Lsp8Asset[]);
          }
        );

        const lsp12Result = await profile.fetchData('LSP12IssuedAssets[]');
        const createdAssets = lsp12Result.value;

        fetchCreations(web3!, address!, createdAssets as string[]).then(
          ([mappedLsp7Assets, mappedLsp8Assets]) => {
            setCreatedLsp7Assets(mappedLsp7Assets as Asset[]);
            setCreatedLsp8Assets(mappedLsp8Assets as Asset[]);
          }
        );
      } catch (e) {
        console.log('error', e);
      }
    };

    fetchProfileAssets();
  }, [address]);

  return [
    { lsp7: lsp7Assets, lsp8: lsp8Assets },
    { setLsp7: setLsp7Assets, setLsp8: setLsp8Assets },
    { lsp7: createdLsp7Assets, lsp8: createdLsp8Assets },
    {
      setCreatedLsp7: setCreatedLsp7Assets,
      setCreatedLsp8: setCreatedLsp8Assets,
    },
  ];
};
