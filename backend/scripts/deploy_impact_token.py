# /backend/scripts/deploy_impact_token.py
import json
import os
from web3 import Web3

GANACHE_URL = os.getenv("GANACHE_URL", "http://127.0.0.1:7545")

BUILD_DIR = "build"
ABI_PATH = os.path.join(BUILD_DIR, "ImpactToken.json")
ADDRESS_PATH = os.path.join(BUILD_DIR, "ImpactToken.address")


def main():
    # ---------- Load ABI + Bytecode ----------
    if not os.path.exists(ABI_PATH):
        raise FileNotFoundError("❌ ImpactToken.json not found. Compile first.")

    with open(ABI_PATH, "r", encoding="utf-8") as f:
        compiled = json.load(f)

    abi = compiled["abi"]
    bytecode = compiled["bytecode"]

    # ---------- Connect to Ganache ----------
    w3 = Web3(Web3.HTTPProvider(GANACHE_URL))
    if not w3.is_connected():
        raise RuntimeError("❌ Failed to connect to Ganache")

    accounts = w3.eth.accounts
    if not accounts:
        raise RuntimeError("❌ No Ganache accounts found")

    deployer = accounts[0]

    print(f"🚀 Deploying ImpactToken from {deployer}")

    # ---------- Contract Object ----------
    contract = w3.eth.contract(abi=abi, bytecode=bytecode)

    # ---------- Transaction ----------
    nonce = w3.eth.get_transaction_count(deployer)

    tx = contract.constructor().build_transaction({
        "from": deployer,
        "nonce": nonce,
        "gas": 3_000_000,
        "gasPrice": w3.to_wei("20", "gwei"),
    })

    tx_hash = w3.eth.send_transaction(tx)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    address = receipt.contractAddress

    # ---------- Save Address ----------
    with open(ADDRESS_PATH, "w", encoding="utf-8") as f:
        f.write(address)

    print("✅ ImpactToken deployed successfully")
    print(f"📍 Contract Address: {address}")


if __name__ == "__main__":
    main()
