// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Recovery {
    struct ShamirEncryptedShare {
        bytes encryptedShare;
    }

    mapping(address => address[]) private userToConfidants;
    mapping(address => mapping(address => ShamirEncryptedShare)) private userToShares;

    function createShares(address dealer, address[] calldata confidants, bytes[] calldata encryptedShares) public {
        require(dealer == tx.origin, "dealer address and sender address should be the same");

        uint length = confidants.length;
        uint sharesLength = encryptedShares.length;

        require(sharesLength != 0, "number of shares cannot be 0");
        require(length == sharesLength, "number of confidants and shares must be equal");

        address confidant = confidants[0];
        bytes memory share = encryptedShares[0];
        uint256 shareSize = share.length;

        for (uint i=1; i < sharesLength; i++) {
            confidant = confidants[i];
            share = encryptedShares[i];

            require(share.length == shareSize, "shares cannot be of unequal size");

            userToConfidants[dealer].push(confidant);
            userToShares[dealer][confidant] = ShamirEncryptedShare(share);
        }
    }

    function getEncryptedShare(address dealer, address confidant) public view returns (bytes memory) {
        return userToShares[dealer][confidant].encryptedShare;
    }

    function getAllConfidants(address dealer) public view returns (address[] memory) {
        return userToConfidants[dealer];
    }
}