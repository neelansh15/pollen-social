// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProfileNFT is ERC1155, Ownable {
    uint256 public tokenId;
    mapping(uint256 => string) public uris;

    constructor() ERC1155("") {}

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
}
