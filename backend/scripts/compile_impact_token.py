# /backend/scripts/compile_impact_token.py
import json
import os
from solcx import compile_standard, install_solc


def main():
    contracts_dir = os.path.join("contracts")
    build_dir = os.path.join("build")
    os.makedirs(build_dir, exist_ok=True)

    source_path = os.path.join(contracts_dir, "ImpactToken.sol")
    with open(source_path, "r", encoding="utf-8") as f:
        source = f.read()

    version = "0.8.20"
    install_solc(version)

    compiled_sol = compile_standard(
        {
            "language": "Solidity",
            "sources": {
                "ImpactToken.sol": {"content": source}
            },
            "settings": {
                "outputSelection": {
                    "*": {"*": ["abi", "evm.bytecode"]}
                }
            },
        },
        solc_version=version,
    )

    contract_data = compiled_sol["contracts"]["ImpactToken.sol"]["ImpactToken"]
    abi = contract_data["abi"]
    bytecode = contract_data["evm"]["bytecode"]["object"]

    out_path = os.path.join(build_dir, "ImpactToken.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "abi": abi,
                "bytecode": bytecode
            },
            f,
            indent=2
        )

    print(f"✅ ImpactToken ABI + bytecode written to {out_path}")


if __name__ == "__main__":
    main()
