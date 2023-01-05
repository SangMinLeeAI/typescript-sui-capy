import { JsonRpcProvider, Network, Ed25519Keypair, RawSigner } from '@mysten/sui.js';

async function main() {
    console.log("Hello, world");
    let gasObjects;
    const provider = new JsonRpcProvider(Network.DEVNET);
    const TEST_MNEMONICS = "blood road valid dinosaur follow visual cheap beach fantasy cart news moment"
    const keypair_ed25519 = Ed25519Keypair.deriveKeypair(TEST_MNEMONICS, "m/44'/784'/0'/0'/0'");

    const signer = new RawSigner(
        keypair_ed25519, // or use keypair_secp256k1 for ECDSA secp256k1
        // new JsonRpcProvider('<https://gateway.devnet.sui.io:443>')
        provider
    );



    const address = await signer.getAddress();
    console.log("🚀 ~ file: app.ts:15 ~ main ~ address", address);

    // await getAirDrop();

    // await sendBoxBatch();
    // await capyBoxMint();
    // makeoneCoin();

    await sendBox('0x0dfa3f3d79ad4576982b5904e3af71d004254388','0xb99502c157bb683c4ded5cac9ffd2f6d14f8d9fa');








    async function sendBox(boxID: string, recipID: string) {
        await signer.executeMoveCall({
            packageObjectId: '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc',
            module: 'capy_winter',
            function: 'send_gift',

            arguments: [
                '0xf13062d96a9a595bd186c9e33b053f75a21c9698',
                boxID,
                recipID,
                'Happy New Year'
            ],
            typeArguments: [],
            gasBudget: 4000,
            gasPayment:'0xfd10711fe22f43803b717592071453376efea3bd'
        });
    }

    async function sendBoxBatch() {
        let boxObjects = await provider.getObjectsOwnedByAddress(
            address
        );
        console.log("🚀 ~ file: app.ts:31 ~ sendBox ~ boxObjects", boxObjects)

        boxObjects.filter(e => e.type === "0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc::capy_winter::GiftBox").forEach(e => sendBox(e.objectId,"0xb99502c157bb683c4ded5cac9ffd2f6d14f8d9fa"));

    }


    async function makeoneCoin() {
        let gasObjects = await provider.getObjectsOwnedByAddress(
            address
        );
        console.log('address', address);

        gasObjects = gasObjects.filter(e => e.type === "0x2::coin::Coin<0x2::sui::SUI>");
        console.log("gasObjects", gasObjects);

        while (gasObjects.length >= 2) {
            let main_object = gasObjects[0];
            let second_object = gasObjects[1];

            let merge = await signer.mergeCoin({
                "primaryCoin": main_object.objectId,
                "coinToMerge": second_object.objectId,
                "gasBudget": 1000
            });
            console.log("merge", merge);

            gasObjects = await provider.getObjectsOwnedByAddress(
                await signer.getAddress()
            );
            gasObjects = gasObjects.filter(e => e.type === "0x2::coin::Coin<0x2::sui::SUI>");
            console.log("gasObjects", gasObjects);
        };

    }


    async function capyBoxMint() {
        const capyBox = await signer.executeMoveCall({
            packageObjectId: '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc',
            module: 'capy_winter',
            function: 'buy_gift',

            arguments: [
                '0xf13062d96a9a595bd186c9e33b053f75a21c9698',
                `2`,
                ['0x2e5142bfceaca301ff807f33671ce5a476707b8e',
                ]
            ],
            typeArguments: [],
            gasBudget: 4000,
        });
        console.log("🚀 ~ file: app.ts:35 ~ main ~ capyBox", capyBox);
    }

    async function getAirDrop() {
        const airdrop = await provider.requestSuiFromFaucet(
            '0xc0b9147e4bed70c6f390b261ba87f33f966df68e'
        );
        console.log("airdrop", airdrop);
    }
}



main();