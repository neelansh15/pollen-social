import { writeFileSync } from "fs";
import { ethers } from "hardhat";

async function main() {
    const ProfileHub = await ethers.getContractFactory("ProfileHub");
    const ProfileNFT = await ethers.getContractFactory("ProfileNFT");

    const abiHub = ProfileHub.interface.format('json')
    const abiNFT = ProfileNFT.interface.format('json')

    writeFileSync('./api/abis/ProfileHub.json', abiHub)
    writeFileSync('./frontend/src/abis/ProfileHub.json', abiHub)

    writeFileSync('./api/abis/ProfileNFT.json', abiNFT)
    writeFileSync('./frontend/src/abis/ProfileNFT.json', abiNFT)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
