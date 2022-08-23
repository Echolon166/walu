export type AssetType = 'LSP7' | 'LSP8' | null;

export class Asset {
  contractAddress: string;

  name: string;

  symbol: string;

  creators: string[];

  metadata: {
    description: string;
    links: {
      title: string;
      url: string;
    }[];
    icon: {
      width: number;
      height: number;
      hashFunction: string;
      hash: string;
      url: string;
    }[];
    images: {
      width: number;
      height: number;
      hashFunction: string;
      hash: string;
      url: string;
    }[];
    assets: {
      hashFunction: string;
      hash: string;
      url: string;
      fileType: string;
    }[];
  };

  type?: AssetType;

  id?: number;

  amount?: number;

  constructor(rawAsset: any) {
    const [contractAddress, lsp4Asset, type, id, amount] = rawAsset;

    this.contractAddress = contractAddress;
    this.name = (lsp4Asset[1]?.value as string) ?? '';
    this.symbol = (lsp4Asset[2]?.value as string) ?? '';
    this.metadata = (lsp4Asset[3]?.value as any)?.LSP4Metadata ?? [];
    this.creators = (lsp4Asset[4]?.value as string[]) ?? [];
    this.type = type;
    this.id = id;
    this.amount = amount;
  }
}
