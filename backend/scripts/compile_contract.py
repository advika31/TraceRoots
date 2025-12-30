# /backend/scripts/compile_contract.py

import json
import os
from solcx import compile_standard, install_solc


def main():
    contracts_dir = os.path.join("contracts")
    build_dir = os.path.join("build")
    os.makedirs(build_dir, exist_ok=True)

    source_path = os.path.join(contracts_dir, "BatchRegistry.sol")
    with open(source_path, "r", encoding="utf-8") as f:
        source = f.read()

    version = "0.8.17"
    install_solc(version)

    compiled_sol = compile_standard(
        {
            "language": "Solidity",
            "sources": {"BatchRegistry.sol": {"content": source}},
            "settings": {
                "outputSelection": {
                    "*": {"*": ["abi", "evm.bytecode"]}
                }
            },
        },
        solc_version=version,
    )

    contract_data = compiled_sol["contracts"]["BatchRegistry.sol"]["BatchRegistry"]
    abi = contract_data["abi"]
    bytecode = contract_data["evm"]["bytecode"]["object"]

    out_path = os.path.join(build_dir, "BatchRegistry.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"abi": abi, "bytecode": bytecode}, f, indent=2)

    print(f"Wrote ABI and bytecode to {out_path}")


if __name__ == "__main__":
    main()



