// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProfileNFT.sol";

contract ProfileHub is ERC1155, Ownable {
    uint256 public tokenId;
    mapping(address => uint256) public owns;
    mapping(uint256 => string) public uris;

    constructor() ERC1155("") {}

    /**
        Mint Profile NFT Token and create the collection for user
     */
    function mint(string memory profileURI)
        external
        onlyOwner
        returns (address)
    {
        // One address can only mint one profile nft (concept for now)
        require(owns[msg.sender] == 0, "MAX_PROFILE_NFT_LIMIT");

        _mint(msg.sender, ++tokenId, 1, "");
        owns[msg.sender] = tokenId;

        uris[tokenId] = profileURI;

        ProfileNFT nft = new ProfileNFT();
        nft.transferOwnership(msg.sender);

        return address(nft);
    }

    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return uris[_tokenId];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        // One address can only mint one profile nft (concept for now)
        require(owns[to] == 0, "MAX_PROFILE_NFT_LIMIT");

        _safeTransferFrom(from, to, id, amount, data);

        owns[to] = id;
        owns[from] = 0;
    }

    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure override {
        revert("NO_BATCH_OPERATIONS");
    }
}
