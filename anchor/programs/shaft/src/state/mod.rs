use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub maker: Pubkey,
    pub mint_nft: Pubkey,
    pub price: u64,
    pub bump: u8,
}
