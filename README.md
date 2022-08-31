# Walu

Wallet App & Vault Manager for managing assets and vaults on Lukso Blockchain.

Link: https://walu-echolon166.vercel.app/

Video Demo: [Youtube]()

## About

- Walu is a Next.js application, built for the [Universal Profile Tools - Token & NFT Wallet With Vault Manager](https://gitcoin.co/issue/29154) hackathon.

- Built by: Erdem Değer (erdemdeger11@hotmail.com)

## Development

- Clone the repository

```shell
git clone https://github.com/Echolon166/walu.git
```

- Create a .env.local file and save the controller private key of the app
  - Example can be found here: [.env.example](.env.example)

- Send funds to controller
  - [Faucet](https://faucet.l16.lukso.network/)


- Install dependencies:

```shell
yarn
```

- Run the development server

```shell
yarn dev
```

### Known Issues

- Minted tokens doesn't update UI without refreshing manually
- Sending tokens from vaults doesn't update other vaults & main account

