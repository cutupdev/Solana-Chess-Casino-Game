use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    system_instruction,
    sysvar::{rent::Rent, Sysvar}, 
    program_pack::Pack,
    pubkey::Pubkey,
};

use crate::{error::EscrowError, instruction::EscrowInstruction, state::Escrow};

pub struct Processor;
impl Processor {
    pub fn process(
        accounts: &[AccountInfo],
        instruction_data: &[u8],
        program_id: &Pubkey
    ) -> ProgramResult {
        msg!("Process -> Instruction");
        let instruction = EscrowInstruction::unpack(instruction_data)?;

        msg!("Instruction -> Init");
        match instruction {
            EscrowInstruction::InitEscrow { is_cretor, amount } => {
                msg!("Instruction: InitEscrow");
                Self::process_init_escrow(accounts, is_cretor, amount)
            }
            EscrowInstruction::WithdrawEscrow { result, amount} => {
                msg!("Instruction: WithdrawEscrow");
                Self::process_withdraw(accounts, result, amount, program_id)
            }
        }
    }

    fn process_init_escrow(
        accounts: &[AccountInfo],
        is_cretor: u8,
        amount: u64,
    ) -> ProgramResult {

        let account_info_iter = &mut accounts.iter();

        let sender = next_account_info(account_info_iter)?;
        // msg!("Taker Pubkey : {}", taker_account.key);

        if !sender.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let fee_account = next_account_info(account_info_iter)?;

        let admin_account = next_account_info(account_info_iter)?;


        let escrow_account = next_account_info(account_info_iter)?;
        // msg!("Escrow account Pubkey : {}", escrow_account.key );

        let pda_account = next_account_info(account_info_iter)?;
        // msg!("PDA account Pubkey : {}", pda_account.key );

        let rent = &Rent::from_account_info(next_account_info(account_info_iter)?)?;

        if !rent.is_exempt(escrow_account.lamports(), escrow_account.data_len()) {
            return Err(EscrowError::NotRentExempt.into());
        }

        let system_program_account = next_account_info(account_info_iter)?;

        {
            let mut escrow_info = Escrow::unpack_unchecked(&escrow_account.data.borrow())?;
    
            escrow_info.is_initialized = true;
            if is_cretor == 1 {
                escrow_info.creator_pubkey = *sender.key;
                escrow_info.amount = amount;
            }
            else {
                escrow_info.competitor_pubkey = *sender.key;
                escrow_info.amount += amount;
            }

            Escrow::pack(escrow_info, &mut escrow_account.try_borrow_mut_data()?)?;
        }

        //----- Transfer Some Sol from Initializer to escrow

        Self::transfer_sol(
            &[
                sender.clone(),     //source
                fee_account.clone(),     //destination
                system_program_account.clone(),
            ],
            amount * 19 / 1000
        )?;

        Self::transfer_sol(
            &[
                sender.clone(),     //source
                admin_account.clone(),     //destination
                system_program_account.clone(),
            ],
            amount * 1 /1000
        )?;

        Self::transfer_sol(
            &[
                sender.clone(),     //source
                pda_account.clone(),     //destination
                system_program_account.clone(),
            ],
            amount * 98 / 100
        )?;

        Ok(())
    }

    //==========================================================================
    fn process_withdraw(
        accounts: &[AccountInfo],
        result: u8,
        amount: u64,
        program_id: &Pubkey
    ) -> ProgramResult {

        msg!("processing withdraw...");
        msg!("result : {}", result);
        msg!("amount : {}", amount);

        let account_info_iter = &mut accounts.iter();

        let admin_account = next_account_info(account_info_iter)?;
        msg!("Admin account Pubkey : {}", admin_account.key );
        
        if !admin_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        msg!("admin_info");

        let escrow_account = next_account_info(account_info_iter)?;
        msg!("Escrow account Pubkey : {}", escrow_account.key );

        let escrow_info = Escrow::unpack_unchecked(&escrow_account.data.borrow())?;

        msg!("next");

        let pda_account = next_account_info(account_info_iter)?;
        // msg!("PDA account Pubkey : {}", pda_account.key );

        let system_program_account = next_account_info(account_info_iter)?;

        let creator = next_account_info(account_info_iter)?;
        msg!("creator Pubkey : {}", creator.key );
        
        if escrow_info.creator_pubkey != *creator.key {
            return Err(ProgramError::InvalidAccountData);
        }

        let competitor;
        if result == 1 {
            competitor = next_account_info(account_info_iter)?;
            msg!("competitor Pubkey : {}", competitor.key );

            if escrow_info.competitor_pubkey != *competitor.key {
                return Err(ProgramError::InvalidAccountData);
            }
        }

        let (pda, nonce) = Pubkey::find_program_address(&[b"chess"], program_id);

        let withdraw_account = next_account_info(account_info_iter)?;
        msg!("withdraw_account Pubkey : {}", withdraw_account.key );

        // msg!("withdraw_account : {}", withdraw_account.key);
        
        if amount != escrow_info.amount {
            return Err(EscrowError::InvalidAmount.into());
        }

        msg!("Sending Sol to the winner account...");

        let sol_ix = system_instruction::transfer(
            pda_account.key,
            withdraw_account.key,
            amount * 98 / 100,
        );
        
        invoke_signed(
            &sol_ix, 
            &[
                pda_account.clone(),
                withdraw_account.clone(),
                system_program_account.clone()
            ], 
            &[&[&b"chess"[..], &[nonce]]]
        );


        // **withdraw_account.try_borrow_mut_lamports()? = withdraw_account
        //     .lamports()
        //     .checked_add(escrow_account.lamports())
        //     .ok_or(EscrowError::AmountOverflow)?;
        // **escrow_account.try_borrow_mut_lamports()? = 0;
        // *escrow_account.try_borrow_mut_data()? = &mut [];
       
        Ok(())
    }

    fn transfer_sol(
        accounts: &[AccountInfo], 
        lamports: u64,
    ) -> ProgramResult{
        let account_info_iter = &mut accounts.iter();

        let source_acc = next_account_info(account_info_iter)?;
        let dest_acc = next_account_info(account_info_iter)?;
        let system_program_acc = next_account_info(account_info_iter)?;

        let sol_ix = system_instruction::transfer(
            source_acc.key,
            dest_acc.key,
            lamports,
        );
        invoke(
            &sol_ix,
            &[
                source_acc.clone(),
                dest_acc.clone(),
                system_program_acc.clone()
            ],
        )?;

        Ok(())
    }

}