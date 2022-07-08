// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ProfileNFT is ERC1155 {
    constructor() ERC1155("https://token-cdn-domain/{id}.json") {}
}
