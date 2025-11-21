#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("3vsCLZj4ACRSXBqKd8DLfunaMsPG26CXBC19ApzNKksp");

#[program]
pub mod shaft {
    use super::*;

    pub fn list_nft(ctx: Context<Make>, price: u64) -> Result<()> {
        ctx.accounts.init_escrow(price, &ctx.bumps)?;

        ctx.accounts.deposit_nft()?;

        Ok(())
    }

    pub fn buy(ctx: Context<Buy>) -> Result<()> {
        ctx.accounts.buy_nft()?;

        Ok(())
    }
}
