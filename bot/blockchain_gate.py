# blockchain_gate.py
# HAYQ Token balance check — Sepolia
# Ով ունի ≥100 HAYQ → Premium access

import asyncio
import aiohttp
from web3 import Web3

# Real Sepolia addresses (deployed)
HAYQ_TOKEN_ADDRESS = "0x7E5c8baC4447D8FA7010AEc8D400Face1b1BEC83"
STAKING_ADDRESS    = "0x054f0CD967656df38853b61E3804Ba4fa7783bA8"
SEPOLIA_RPC        = "https://rpc.sepolia.org"
REQUIRED_BALANCE   = 100  # HAYQ tokens

# Minimal ERC-20 ABI
ERC20_ABI = [
    {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function",
    },
]


def check_hayq_balance(wallet_address: str) -> dict:
    """
    Check HAYQ token + staked balance for a wallet.
    Returns: { wallet, wallet_balance, staked_balance, total, has_enough }
    """
    try:
        w3 = Web3(Web3.HTTPProvider(SEPOLIA_RPC))
        if not w3.is_connected():
            return {"error": "Cannot connect to Sepolia RPC"}

        checksum_addr = Web3.to_checksum_address(wallet_address)

        # Token contract
        token = w3.eth.contract(
            address=Web3.to_checksum_address(HAYQ_TOKEN_ADDRESS),
            abi=ERC20_ABI
        )
        decimals = token.functions.decimals().call()
        divisor = 10 ** decimals

        wallet_raw = token.functions.balanceOf(checksum_addr).call()
        wallet_balance = wallet_raw / divisor

        # Staking contract (same balanceOf interface)
        staking = w3.eth.contract(
            address=Web3.to_checksum_address(STAKING_ADDRESS),
            abi=ERC20_ABI
        )
        try:
            staked_raw = staking.functions.balanceOf(checksum_addr).call()
            staked_balance = staked_raw / divisor
        except Exception:
            staked_balance = 0.0

        total = wallet_balance + staked_balance

        return {
            "wallet": wallet_address,
            "wallet_balance": round(wallet_balance, 4),
            "staked_balance": round(staked_balance, 4),
            "total": round(total, 4),
            "has_enough": total >= REQUIRED_BALANCE,
        }

    except Exception as e:
        return {"error": str(e)}