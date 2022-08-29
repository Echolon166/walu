export const ipfsLink = (
  url: string | undefined | null,
  placeHolder: string = '/assets/images/lukso_white.svg'
) => {
  return url?.replace('ipfs://', 'https://ipfs.io/ipfs/') ?? placeHolder;
};
