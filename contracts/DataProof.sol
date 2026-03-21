
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DataProof
 * @dev Stores cryptographic hashes of healthcare resource data for tamper-proof verification.
 */
contract DataProof {
    event DataStored(address indexed sender, string hash, uint timestamp);

    struct Record {
        string hash;
        uint timestamp;
    }

    Record[] public records;

    // Stores a new hash on the Avalanche blockchain
    function storeHash(string memory _hash) public {
        records.push(Record(_hash, block.timestamp));
        emit DataStored(msg.sender, _hash, block.timestamp);
    }

    // Retrieves all verification records
    function getRecords() public view returns (Record[] memory) {
        return records;
    }
}
