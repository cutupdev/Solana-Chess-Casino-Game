// use core::num;

use solana_program::{
    program_error::ProgramError,
};
use crate::error::EscrowError::InvalidInstruction;

pub enum EscrowInstruction {
    InitEscrow {
        is_cretor: u8,
        amount: u64,
    },

    WithdrawEscrow {
        result: u8,
        amount: u64,
    }
}

impl EscrowInstruction {
    /// Unpacks a byte buffer into a [EscrowInstruction](enum.EscrowInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => {
                let (is_cretor, amount) = rest.split_first().ok_or(InvalidInstruction)?;
                Self::InitEscrow {
                    is_cretor: *is_cretor,
                    amount: Self::unpack_amount(amount)?
                }
            },
            1 => {
                let (result, amount) = rest.split_first().ok_or(InvalidInstruction)?;
                Self::WithdrawEscrow {
                    result: *result,
                    amount: Self::unpack_amount(amount)?,
                }
            },
            _ => return Err(InvalidInstruction.into()),
        })
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
}