use crate::state::Escrow;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

#[derive(Accounts)]
pub struct Make<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(mint::token_program = token_program)]
    pub mint_nft: InterfaceAccount<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint_nft,
        associated_token::authority = maker,
        associated_token::token_program = token_program
    )]
    pub maker_ata_nft: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init,
        payer=maker,
        seeds = [b"escrow", maker.key().as_ref(),mint_nft.key().as_ref()],
        space = Escrow::INIT_SPACE + 8,
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    #[account(
        init,
        payer=maker,
        associated_token::mint = mint_nft,
        associated_token::authority = escrow,
        associated_token::token_program = token_program
    )]
    pub vault_nft: InterfaceAccount<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> Make<'info> {
    pub fn init_escrow(&mut self, receive: u64, bumps: &MakeBumps) -> Result<()> {
        self.escrow.set_inner(Escrow {
            maker: self.maker.key(),
            mint_nft: self.mint_nft.key(),
            price: receive,
            bump: bumps.escrow,
        });
        Ok(())
    }

    pub fn deposit_nft(&mut self) -> Result<()> {
        let transfer_accounts = TransferChecked {
            from: self.maker_ata_nft.to_account_info(),
            to: self.vault_nft.to_account_info(),
            authority: self.mint_nft.to_account_info(),
            mint: self.maker.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), transfer_accounts);

        transfer_checked(cpi_ctx, 1, 0)
    }
}
