// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ProfileNFT is ERC1155 {
    uint256 public tokenId;
    mapping(uint256 => string) public uris;

    address public owner;
    address public factory;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    constructor() ERC1155("") {
        owner = msg.sender;
        factory = msg.sender;
    }

    /**
        Mint a new Post
    */
    function mint(string memory newUri) public onlyOwner {
        _mint(msg.sender, ++tokenId, 1, "");
        uris[tokenId] = newUri;
    }

    /**
        Return locally stored URI for a specific tokenId
     */
    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return uris[_tokenId];
    }

    function transferOwnership(address newOwner) public {
        require(msg.sender == factory, "ONLY_FACTORY_TRANSFER");
        owner = newOwner;
        emit OwnershipTransferred(msg.sender, owner);
    }

    // To think about: Transfer of Posts as NFTs, to keep or not to keep.
}
