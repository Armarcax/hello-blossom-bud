# bot/blockchain_connector.py
"""
Blockchain connector for HAYQ bot
Connects to HAYQ smart contracts using web3.py
"""
import json
from web3 import Web3
from config import HAYQ_CONTRACT_ADDRESS, RPC_URL

class BlockchainConnector:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(RPC_URL))
        self.contract = None
        
        # Load ABI
        with open('abi.json', 'r') as f:
            abi_data = json.load(f)
            self.abi = abi_data.get('abi', [])
        
        # Initialize contract if address is set
        if HAYQ_CONTRACT_ADDRESS:
            self.contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(HAYQ_CONTRACT_ADDRESS),
                abi=self.abi
            )
    
    def is_connected(self):
        """Check if connected to blockchain"""
        return self.w3.is_connected()
    
    def get_total_supply(self):
        """Get HAYQ total supply"""
        if not self.contract:
            return 0
        try:
            return self.contract.functions.totalSupply().call()
        except Exception as e:
            print(f"Error getting total supply: {e}")
            return 0
    
    def get_balance(self, address):
        """Get HAYQ balance for address"""
        if not self.contract:
            return 0
        try:
            checksum_address = Web3.to_checksum_address(address)
            return self.contract.functions.balanceOf(checksum_address).call()
        except Exception as e:
            print(f"Error getting balance: {e}")
            return 0
    
    def format_amount(self, amount, decimals=18):
        """Format token amount from wei"""
        return amount / (10 ** decimals)

# Singleton instance
blockchain = BlockchainConnector()
