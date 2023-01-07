import { JsonRpcProvider, Network, Ed25519Keypair, RawSigner } from '@mysten/sui.js';
async function main() {
    console.log("Hello, world");
    let gasObjects;
    const provider = new JsonRpcProvider(Network.DEVNET);
    const capyPackageID = '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc'
    const itemMarket = '0x3c4706fd9deec1674137d92c1a2296001489fa46'
    const typeArgumentForAddItem = '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc::capy_item::CapyItem'
    const itemOnHead: string[] = ['holiday hat','astro hat','cowboy hat','sui cap']
    const itemOnBody: string[] = ['holiday coat','astro suit','cowboy shirt']
    const itemOnLegs: string[] = ['holiday skis','astro boots','cowboy pants']
    const itemOnNeck: string[] = ['holiday scarf','pearls','wild Rag']


    const TEST_MNEMONICS = "impact pizza drum shiver ready sense retire fluid upper liquid medal degree"
    // "blood road valid dinosaur follow visual cheap beach fantasy cart news moment"
    const keypair_ed25519 = Ed25519Keypair.deriveKeypair(TEST_MNEMONICS, "m/44'/784'/0'/0'/0'");



    // await getAirDrop();

    // await sendBoxBatch();
    // await capyBoxMint(1);
    // await capyBoxMint(2);
    // await capyBoxMint(3);

    // await sendBox("0x7d8d0b01ce010aeeddf722bc57621f180200a6f6", "0xc0b9147e4bed70c6f390b261ba87f33f966df68e")
    // await sendBox("0xb7cb547b895ae8960e21e0aa5cb7089c1bf8fdbb", "0xc0b9147e4bed70c6f390b261ba87f33f966df68e")

    // await makeoneCoin();

    // await mintPremiumBox();
    // await openPremiumBox();
    // await buyItem();
    // await addItem();
    const walletSigner = await getSignerFromMnemonics(TEST_MNEMONICS); 
    const walletAddress = await walletSigner.getAddress();
    // const payCoin = await makeoneCoin(walletSigner, walletAddress);
    // getAirDrop(walletAddress);
    // await buyItem(walletSigner,payCoin);
    await addItem(walletSigner,walletAddress);

    async function getSignerFromMnemonics(mnemonics: string): Promise<RawSigner> {
        return new RawSigner(
            Ed25519Keypair.deriveKeypair(mnemonics, "m/44'/784'/0'/0'/0'"),
            provider
        );
    }

    async function addItem(signer: RawSigner,address: string) {
        const finalGasObjects = await provider.getObjectsOwnedByAddress(address);
        console.log("🚀 ----------------------------------------------------------------🚀")
        console.log("🚀 ~ file: app.ts:53 ~ addItem ~ finalGasObjects", finalGasObjects)
        console.log("🚀 ----------------------------------------------------------------🚀")
        const capyObjects = finalGasObjects.filter(e => e.type === '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc::capy::Capy');
        const itemObjects = finalGasObjects.filter(e => e.type === '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc::capy_item::CapyItem');


        for (const itemObject of itemObjects){
            let addItemResult = await signer.executeMoveCall({
                packageObjectId: capyPackageID,
                module: 'capy',
                function: 'add_item',

                arguments: [
                    capyObjects[0].objectId,
                    itemObject.objectId,
                ],
                typeArguments: [typeArgumentForAddItem],
                gasBudget: 4000,
            });
            console.log("🚀 ------------------------------------------------------------🚀");
            console.log("🚀 ~ file: app.ts:63 ~ addItem ~ addItemResult", addItemResult);
            console.log("🚀 ------------------------------------------------------------🚀");
        }
        
    }
    
    async function buyItem(signer: RawSigner, coinForPay: string) {
        console.log("============================Buy Item========================");
        const buyHead = await buyPartItem(signer, coinForPay, itemOnHead);
        console.log("🚀 ------------------------------------------------🚀")
        console.log("🚀 ~ file: app.ts:48 ~ buyItem ~ buyHead", buyHead)
        console.log("🚀 ------------------------------------------------🚀")
        const buyBody = await buyPartItem(signer, coinForPay, itemOnBody);
        console.log("🚀 ------------------------------------------------🚀")
        console.log("🚀 ~ file: app.ts:52 ~ buyItem ~ buyBody", buyBody)
        console.log("🚀 ------------------------------------------------🚀")
        const buyNect = await buyPartItem(signer, coinForPay, itemOnNeck);
        console.log("🚀 ------------------------------------------------🚀")
        console.log("🚀 ~ file: app.ts:56 ~ buyItem ~ buyNect", buyNect)
        console.log("🚀 ------------------------------------------------🚀")
        const buyLegs = await buyPartItem(signer, coinForPay, itemOnLegs);
        console.log("🚀 ------------------------------------------------🚀")
        console.log("🚀 ~ file: app.ts:60 ~ buyItem ~ buyLegs", buyLegs)
        console.log("🚀 ------------------------------------------------🚀")
        console.log("============================Buy Item========================");
        
    }

    async function buyPartItem(signer: RawSigner, coinForPay: string, partItemList: string[]) {
        return await signer.executeMoveCall({
            packageObjectId: '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc',
            module: 'capy_item',
            function: 'buy_mul_coin',

            arguments: [
                itemMarket,
                partItemList[Math.floor(Math.random() * partItemList.length)],
                [coinForPay]
            ],
            typeArguments: [],
            gasBudget: 4000,
        });
    }

    async function openPremiumBox(signer: RawSigner,address: string) {
        console.log("============================open Premium Box========================");
        let premiumBox = await provider.getObjectsOwnedByAddress(address);
        premiumBox = premiumBox.filter(e => {
            console.log("🚀 ~ file: app.ts:43 ~ openPremiumBox ~ premiumBox", premiumBox)
            return e.type === '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc::capy_winter::PremiumBox'
        })
        const openPremium = await signer.executeMoveCall({
            packageObjectId: '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc',
            module: 'capy_winter',
            function: 'open_premium',

            arguments:[
                '0xaf10a1ce520026234ad8c89080a43b28cb170553',
                premiumBox[0].objectId,
            ],
            typeArguments: [],
            gasBudget:4000,
            
        })
        console.log("🚀 ---------------------------------------------------------------🚀");
        console.log("🚀 ~ file: app.ts:59 ~ openPremiumBox ~ openPremium", openPremium);
        console.log("🚀 ---------------------------------------------------------------🚀");
        
    }


    async function mintPremiumBox(signer: RawSigner, coinForPay: string,address: string) {
        console.log("===================Premium box============================")
        let premiumTicket = await provider.getObjectsOwnedByAddress(
            address
        );
        premiumTicket = premiumTicket.filter(e => e.type === '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc::capy_winter::PremiumTicket');
        const getPremiumBox = await signer.executeMoveCall({
            packageObjectId: '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc',
            module: 'capy_winter',
            function: 'buy_premium',

            arguments: [
                '0xf13062d96a9a595bd186c9e33b053f75a21c9698',
                premiumTicket[0].objectId,
                [coinForPay,
                ]
            ],
            typeArguments: [],
            gasBudget: 4000,
        });
        console.log("🚀 ~ file: app.ts:54 ~ mintPremiumBox ~ premiumTicket[0].objectId,", premiumTicket[0].objectId);
        console.log("🚀 ~ file: app.ts:54 ~ mintPremiumBox ~ prmiumBox", getPremiumBox);
        console.log("===================Premium box============================");

    }


    async function sendBox(signer: RawSigner,boxID: string, recipID: string) {
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
        });
    }

    async function sendBoxBatch(signer: RawSigner, coinForPay: string, recipID: string, address: string) {
        console.log("++++++++++++++++++++send Box Batch+++++++++++++++++++++++++++++++")
        let boxObjects = await provider.getObjectsOwnedByAddress(
            address
        );
        console.log("🚀 ~ file: app.ts:31 ~ sendBox ~ boxObjects", boxObjects);

        boxObjects = boxObjects.filter(e => e.type === "0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc::capy_winter::GiftBox");
        for (const boxObject of boxObjects){
           let sendBoxReult =  await sendBox(signer, boxObject.objectId, recipID);
           console.log("🚀 ----------------------------------------------------------------🚀")
           console.log("🚀 ~ file: app.ts:189 ~ sendBoxBatch ~ sendBoxReult", sendBoxReult)
           console.log("🚀 ----------------------------------------------------------------🚀")
           
        }

        console.log("++++++++++++++++++++send Box Batch+++++++++++++++++++++++++++++++");
        
    }


    async function makeoneCoin(signer: RawSigner, address: string): Promise<string> {
        let gasObjects = await provider.getObjectsOwnedByAddress(
            address
        );
        console.log('address', address);

        gasObjects = gasObjects.filter(e => e.type === "0x2::coin::Coin<0x2::sui::SUI>");
        console.log("gasObjects", gasObjects);

        while (gasObjects.length > 2) {
            let main_object = gasObjects[0];
            let second_object = gasObjects[1];

            let merge = await signer.mergeCoin({
                "primaryCoin": main_object.objectId,
                "coinToMerge": second_object.objectId,
                "gasBudget": 1000
            });
            console.log("merge", merge);

            gasObjects = await provider.getObjectsOwnedByAddress(
                address
            );
            gasObjects = gasObjects.filter(e => e.type === "0x2::coin::Coin<0x2::sui::SUI>");
            console.log("gasObjects", gasObjects);
        };
        return gasObjects[0].objectId

    }


    async function capyBoxMint(signer: RawSigner, boxNumber:number, coinForPay: string) {
        const capyBox = await signer.executeMoveCall({
            packageObjectId: '0x30136e80e16ac92ff33a0ac2d67c64dc129eb0bc',
            module: 'capy_winter',
            function: 'buy_gift',

            arguments: [
                '0xf13062d96a9a595bd186c9e33b053f75a21c9698',
                boxNumber,
                [coinForPay,
                ]
            ],
            typeArguments: [],
            gasBudget: 4000,
        });
        console.log("🚀 ~ file: app.ts:35 ~ main ~ capyBox", capyBox);
    }

    async function getAirDrop(address: string) {
        const airdrop = await provider.requestSuiFromFaucet(
            address
        );
        console.log("airdrop", airdrop);

    }
}



main();