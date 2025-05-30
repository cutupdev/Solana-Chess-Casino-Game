use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};
use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs}; 

pub struct Escrow {
    pub is_initialized: bool,
    pub creator_pubkey: Pubkey,
    pub competitor_pubkey: Pubkey,
    pub amount: u64,
}

impl Sealed for Escrow {}

impl IsInitialized for Escrow {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Escrow {
    const LEN: usize = 73;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, Escrow::LEN];
        let (
            is_initialized,
            creator_pubkey,
            competitor_pubkey,
            amount,
        ) = array_refs![src, 1, 32, 32, 8];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        Ok(Escrow {
            is_initialized,
            creator_pubkey: Pubkey::new_from_array(*creator_pubkey),
            competitor_pubkey: Pubkey::new_from_array(*competitor_pubkey),
            amount: u64::from_le_bytes(*amount),
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Escrow::LEN];
        let (
            is_initialized_dst,
            creator_pubkey_dst,
            competitor_pubkey_dst,
            amount_dst,
        ) = mut_array_refs![dst, 1, 32, 32, 8];

        let Escrow {
            is_initialized,
            creator_pubkey,
            competitor_pubkey,
            amount,
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;
        creator_pubkey_dst.copy_from_slice(creator_pubkey.as_ref());
        competitor_pubkey_dst.copy_from_slice(competitor_pubkey.as_ref());
        *amount_dst = amount.to_le_bytes();
    }
}