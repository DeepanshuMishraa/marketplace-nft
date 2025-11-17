use anchor_lang::prelude::*;

#[event]
pub struct ListingCreated {
    pub maker: Pubkey,
    pub mint_nft: Pubkey,
    pub price: u64,
    pub escrow: Pubkey,
}

#[event]
pub struct ListingFinished {
    pub maker: Pubkey,
    pub taker: Pubkey,
    pub mint_nft: Pubkey,
    pub price: u64,
}