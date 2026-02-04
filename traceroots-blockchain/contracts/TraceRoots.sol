// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TraceRoots {
    struct Batch {
        string batchId;
        string cropType;
        string originHash;
        uint256 expiryDate;
        uint256 timestamp;
    }

    mapping(string => Batch) public batches;

    function addBatch(
        string memory _batchId,
        string memory _cropType,
        string memory _originHash,
        uint256 _expiryDate
    ) public {
        batches[_batchId] = Batch(
            _batchId,
            _cropType,
            _originHash,
            _expiryDate,
            block.timestamp
        );
    }

    function getBatch(string memory _batchId)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        Batch memory b = batches[_batchId];
        return (
            b.batchId,
            b.cropType,
            b.originHash,
            b.expiryDate,
            b.timestamp
        );
    }
}
