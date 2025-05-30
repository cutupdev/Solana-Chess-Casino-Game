use thiserror::Error;

use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum EscrowError {
    /// Invalid instruction
    #[error("Invalid Instruction")]
    InvalidInstruction,
    /// Not Rent Exempt
    #[error("Not Rent Exempt")]
    NotRentExempt,
    /// Expected Amount Mismatch
    #[error("Expected Amount Mismatch")]
    ExpectedAmountMismatch,
    /// Amount Overflow
    #[error("Amount Overflow")]
    AmountOverflow,
    /// Invalid Account
    #[error("Invalid Account")]
    InvalidAccount,
    /// Invalid Amount
    #[error("Invalid Amount")]
    InvalidAmount,
    /// Invalid Owner
    #[error("Invalid Owner")]
    InvalidOwner,
    #[error("Invalid PDA Seeds")]
    InvalidPdaSeeds,

}

impl From<EscrowError> for ProgramError {
    fn from(e: EscrowError) -> Self {
        ProgramError::Custom(e as u32)
    }
}