type Metadata = {
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

class Asset {
  contractAddress: string;

  name: string;

  symbol: string;

  creators: string[];

  metadata: Metadata;

  constructor(contractAddress: string, rawAsset: any) {
    this.contractAddress = contractAddress;
    this.name = (rawAsset[1]?.value as string) ?? '';
    this.symbol = (rawAsset[2]?.value as string) ?? '';
    this.metadata = (rawAsset[3]?.value as any)?.LSP4Metadata ?? [];
    this.creators = (rawAsset[4]?.value as string[]) ?? [];
  }
}

export class Lsp7Asset extends Asset {
  balance?: number;

  constructor(contractAddress: string, rawAsset: any, balance?: number) {
    super(contractAddress, rawAsset);

    this.balance = balance;
  }
}

export class Lsp8Asset extends Asset {
  id: string;

  lsp8Metadata: Metadata;

  constructor(
    contractAddress: string,
    rawAsset: any,
    id: string,
    lsp8Metadata: any
  ) {
    super(contractAddress, rawAsset);

    this.id = id;
    this.lsp8Metadata = lsp8Metadata[0]?.value?.LSP4Metadata;
  }
}
