// /backend/contracts/BatchRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract BatchRegistry {

    struct Batch {
        uint256 batchId;
        string cropType;
        uint256 quantityKg;
        address farmer;
        uint256 timestamp;
        bool exists;
    }

    mapping(uint256 => Batch) public batches;
    mapping(bytes32 => bool) public fingerprints;

    event BatchRegistered(
        uint256 indexed batchId,
        address indexed farmer,
        bytes32 fingerprint
    );

    function registerBatch(
        uint256 batchId,
        string calldata cropType,
        uint256 quantityKg
    ) external {
        require(bytes(cropType).length > 0, "Crop type required");
        require(quantityKg > 0, "Quantity must be > 0");
        require(!batches[batchId].exists, "Batch already exists");

        bytes32 fingerprint = keccak256(
            abi.encodePacked(batchId, cropType, quantityKg, msg.sender)
        );

        fingerprints[fingerprint] = true;

        batches[batchId] = Batch({
            batchId: batchId,
            cropType: cropType,
            quantityKg: quantityKg,
            farmer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit BatchRegistered(batchId, msg.sender, fingerprint);
    }

    function verifyBatch(
        uint256 batchId,
        string calldata cropType,
        uint256 quantityKg,
        address farmer
    ) external view returns (bool) {
        bytes32 fingerprint = keccak256(
            abi.encodePacked(batchId, cropType, quantityKg, farmer)
        );
        return fingerprints[fingerprint];
    }
}
