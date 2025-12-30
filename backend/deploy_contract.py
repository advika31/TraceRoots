# /backend/deploy_contract.py

import json
import os
from web3 import Web3


GANACHE_URL = os.getenv("GANACHE_URL", "http://127.0.0.1:7545")
BUILD_JSON = os.path.join("build", "BatchRegistry.json")
ADDRESS_PATH = os.path.join("build", "BatchRegistry.address")


def main():
    with open(BUILD_JSON, "r", encoding="utf-8") as f:
        compiled = json.load(f)

    w3 = Web3(Web3.HTTPProvider(GANACHE_URL))
    assert w3.is_connected(), "Failed to connect to Ganache"

    accounts = w3.eth.accounts
    if not accounts:
        raise RuntimeError("No accounts available in Ganache")

    deployer = accounts[0]

    contract = w3.eth.contract(abi=compiled["abi"], bytecode=compiled["bytecode"])
    tx_hash = contract.constructor().transact({
        "from": deployer,
        "gas": 3_000_000
    })
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    address = tx_receipt.contractAddress

    os.makedirs("build", exist_ok=True)
    with open(ADDRESS_PATH, "w", encoding="utf-8") as f:
        f.write(address)

    print(f"Deployed BatchRegistry at {address}")


if __name__ == "__main__":
    main()



