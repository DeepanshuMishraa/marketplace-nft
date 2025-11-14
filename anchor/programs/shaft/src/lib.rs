#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
pub mod events;
pub mod instructions;
pub mod state;

use events::*;
use instructions::*;

declare_id!("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

#[program]
pub mod shaft {
    use super::*;

    pub fn list_nft(ctx: Context<Make>, price: u64) -> Result<()> {
        ctx.accounts.init_escrow(price, &ctx.bumps)?;

        ctx.accounts.deposit_nft()?;

        emit!(ListingCreated {
            maker: ctx.accounts.maker.key(),
            mint_nft: ctx.accounts.mint_nft.key(),
            price,
            escrow: ctx.accounts.escrow.key(),
        });

        Ok(())
    }

    pub fn buy(ctx: Context<Buy>) -> Result<()> {
        ctx.accounts.buy_nft()?;

        emit!(ListingFinished {
            maker: ctx.accounts.maker.key(),
            taker: ctx.accounts.taker.key(),
            price: ctx.accounts.escrow.price,
            mint_nft: ctx.accounts.mint_nft.key(),
        });
        
        Ok(())
    }
}
