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

