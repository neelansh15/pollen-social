"use strict";

// Access at https://ocxlxn58dtj4.usemoralis.com:2053/server/functions/heluthere?_ApplicationId=86qxw7CFeNkD6F6aDwKiI2iylpwHfuguKLeFVICG
Moralis.Cloud.define("heluthere", async (req) => {
    return "Helu there from IDE!";
})

// code example of creating a sync event from cloud code
let options = {
    chainId: "0x4",
    address: "0xf2ce59484fed0cc824c976e78e644de8f6791fe7",
    topic: "Mint(address, string)",
    abi: {
        type: "event",
        anonymous: false,
        name: "Mint",
        inputs: [
            {
                type: "address",
                name: "owner",
                indexed: true
            },
            {
                type: "string",
                name: "uri",
                indexed: false
            }
        ]
    },
    limit: 500000,
    tableName: "PollenPosts",
    sync_historical: true,
};

Moralis.Cloud.run("watchContractEvent", options, { useMasterKey: true });
