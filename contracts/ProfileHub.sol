// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./ProfileNFT.sol";

contract ProfileHub is ERC1155 {
    address public owner;

    uint256 public tokenId;

    // Which tokenId is mapped to which IPFS URI
    mapping(uint256 => string) public uris;

    // Which tokenId is mapped to which ProfileNFT collection
    mapping(uint256 => address) public tokenCollection;

    // Which user address is mapped to which ProfileNFT collection
    mapping(address => address) public owns;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    event ProfileTransferred(
        address indexed previousOwner,
        address indexed newOwner,
        address indexed profileCollection,
        uint256 tokenId
    );

    event NewProfile(
        address indexed owner,
        address indexed profileCollection,
        uint256 tokenId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    constructor() ERC1155("") {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ADDRESS_ZERO");
        owner = newOwner;
        emit OwnershipTransferred(msg.sender, newOwner);
    }

    /**
        Mint Profile NFT Token and create the collection for user
     */
    function mint(string memory profileURI)
        external
        onlyOwner
        returns (address)
    {
        // One address can only mint one profile nft (concept for now)
        require(owns[msg.sender] == address(0), "MAX_PROFILE_NFT_LIMIT");

        _mint(msg.sender, ++tokenId, 1, "");

        // Set once only
        uris[tokenId] = profileURI;

        ProfileNFT nft = new ProfileNFT();
        nft.transferOwnership(msg.sender);

        // Set here. Can be changed on transfer
        owns[msg.sender] = address(nft);

        // Set once only
        tokenCollection[tokenId] = address(nft);

        emit NewProfile(msg.sender, address(nft), tokenId);

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
        require(owns[to] == address(0), "MAX_PROFILE_NFT_LIMIT");

        _safeTransferFrom(from, to, id, amount, data);

        ProfileNFT nft = ProfileNFT(tokenCollection[id]);
        nft.transferOwnership(to);

        owns[to] = tokenCollection[id];
        owns[from] = address(0);

        emit ProfileTransferred(from, to, tokenCollection[id], id);
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
