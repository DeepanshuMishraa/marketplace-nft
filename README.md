## Shaft - NFT MarketPlace

Shaft is a Simple NFT MarketPlace where you can trade nfts with people very easily. Just List your nft for a certain price and make it open for the world to buy.

- You can List NFTs
- You can explore NFTs
- You can Buy  NFTs
- You can view the NFTs owned by you

https://shaft-marketplace.vercel.app : (Live Demo)

## Setup Locally

### Client (Next Js)

```
git clone git@github.com:DeepanshuMishraa/marketplace-nft.git

cd marketplace-nft

pnpm install

cp .env.example .env

fill out the env variables

pnpm db:migrate
pnpm db:generate
pnpm db:push

pnpm dev
```

## Program

```
cd shaft

anchor build

anchor deploy

```


## User Story

- As a user, I want to be able to buy and sell Nfts with ease. Doing it manually deciding prices , asking for public key and trusting the other party blindly is a nightmare.

- I need a way to securely list my nfts and share them with the world so that whoever is interested can buy them.

- As a Creator i want to list my NFTs on shaft with a set price , so that whoever wants to buy them can purchase them instantly without manual negotiation and trust issues.

- As a Buyer , i want to see all the different NFTs and purchase them instantly for the fixed listed price so that i can get it without contacting the seller manually and trusting that i will get the NFT once i pay the price.


## Arch Diagram 

