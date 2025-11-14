use crate::state::Escrow;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{close_account, CloseAccount},
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    pub taker: Signer<'info>,
    #[account(mut)]
    pub maker: AccountInfo<'info>,
    #[account(mint::token_program = token_program)]
    pub mint_nft: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        payer=taker,
        associated_token::mint = mint_nft,
        associated_token::authority = taker,
        associated_token::token_program = token_program
    )]
    pub taker_ata_nft: InterfaceAccount<'info, TokenAccount>,
    #[account(
       mut,
       has_one = maker,
       has_one = mint_nft,
       close = maker,
       seeds=  [b"escrow",maker.key().as_ref(),mint_nft.key().as_ref()],
       bump = escrow.bump
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

impl<'info> Buy<'info> {
    pub fn buy_nft(&mut self) -> Result<()> {
        **self.taker.to_account_info().try_borrow_mut_lamports()? -= self.escrow.price;

        **self.maker.to_account_info().try_borrow_mut_lamports()? += self.escrow.price;

        let maker_key = self.maker.key();
        let nft_key = self.mint_nft.key();

        let seeds = &[
            b"escrow",
            maker_key.as_ref(),
            nft_key.as_ref(),
            &[self.escrow.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let transfer_accounts = TransferChecked {
            from: self.vault_nft.to_account_info(),
            to: self.taker_ata_nft.to_account_info(),
            authority: self.escrow.to_account_info(),
            mint: self.mint_nft.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), transfer_accounts)
            .with_signer(signer_seeds);

        transfer_checked(cpi_ctx, 1, 0)?;

        let close_accounts = CloseAccount {
            account: self.vault_nft.to_account_info(),
            destination: self.maker.to_account_info(),
            authority: self.escrow.to_account_info(),
        };

        let close_ctx = CpiContext::new(self.token_program.to_account_info(), close_accounts)
            .with_signer(signer_seeds);

        close_account(close_ctx)
    }
}
