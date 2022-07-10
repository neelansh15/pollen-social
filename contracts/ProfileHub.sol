// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProfileHub.sol";

contract ProfileHub is ERC1155, Ownable {
    constructor() ERC1155("") {}
}
