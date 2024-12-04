const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');

const initApi = async () => {
  const provider = new WsProvider('wss://westmint-rpc.polkadot.io'); // AssetHub Westend RPC endpoint
  const api = await ApiPromise.create({ provider });
  return api;
};

const queryCollectionDetails = async (collectionId) => {
    const api = await initApi();
    const collectionDetails = await api.query.uniques.collection(collectionId);
    return { collectionId, collectionDetails };
  };

const queryNextAssetId = async () => {
  // Connect to the AssetHub Westend RPC
  const provider = new WsProvider('wss://westmint-rpc.polkadot.io');
  const api = await ApiPromise.create({ provider });
  // Query the next available Asset ID
  const nextAssetId = await api.query.assets.nextAssetId();
  console.log(`Next available Asset ID: ${nextAssetId.toString()}`);
  //   return nextAssetId;
  return parseInt(nextAssetId.toString(), 10); // Convert to number

};

// queryNextAssetId().catch(console.error);

const mintNFT = async () => {
    const api = await initApi();
    const keyring = new Keyring({ type: 'sr25519' });
    const seed = process.env.REACT_APP_DOT_ART_WALLET_SEED;
    const account = keyring.addFromUri(seed);
  
    const collectionId = await queryNextAssetId();
    const itemId = 1;
  
    const createCollectionTx = api.tx.uniques.create(collectionId, account.address);
    const mintNFTTx = api.tx.uniques.mint(collectionId, itemId, account.address);
  
    await createCollectionTx.signAndSend(account, ({ status, events }) => {
        if (status.isInBlock) {
          console.log(`Transaction for creating collection included in block ${status.asInBlock}`);
          events.forEach(({ event: { method, data } }) => {
            console.log(`Event: ${method} with data: ${data}`);
          });
        } else if (status.isFinalized) {
          console.log(`Transaction for creating collection finalized in block ${status.asFinalized}`);
        } else {
          console.log(`Transaction status for creating collection: ${status}`);
        }
    });
      
    await mintNFTTx.signAndSend(account, ({ status, events }) => {
        if (status.isInBlock) {
          console.log(`Transaction for minting NFT included in block ${status.asInBlock}`);
          events.forEach(({ event: { method, data } }) => {
            console.log(`Event: ${method} with data: ${data}`);
          });
        } else if (status.isFinalized) {
          console.log(`Transaction for minting NFT finalized in block ${status.asFinalized}`);
        } else {
          console.log(`Transaction status for minting NFT: ${status}`);
        }
    });
  
    return { collectionId, itemId };
  };
  
export default { mintNFT, queryCollectionDetails };

// const mintNFT = async () => {
//     const api = await initApi();
  
//     const keyring = new Keyring({ type: 'sr25519' });
//     const account = keyring.addFromUri(process.env.REACT_APP_DOT_ART_WALLET_SEED);
  
//     // Parameters for the collection
//     const collectionId = await queryNextAssetId().catch(console.error);
//     console.log(`collectionId: ${collectionId}`);

//     const itemId = 1; // Assign a unique item ID within the collection
//     console.log(`account.address: ${account.address}`);
  
//     // Create a collection
//     const createCollectionTx = api.tx.uniques.create(collectionId, account.address);
//     console.log(`createCollectionTx: ${createCollectionTx}`);
  
//     // Mint the NFT
//     const mintNFTTx = api.tx.uniques.mint(collectionId, itemId, account.address);
//     console.log(`mintNFTTx: ${mintNFTTx}`);
  
//     // Submit transactions
//     // await createCollectionTx.signAndSend(account);
//     // await mintNFTTx.signAndSend(account);

//     await createCollectionTx.signAndSend(account, ({ status, events }) => {
//         if (status.isInBlock) {
//           console.log(`Transaction for creating collection included in block ${status.asInBlock}`);
//           events.forEach(({ event: { method, data } }) => {
//             console.log(`Event: ${method} with data: ${data}`);
//           });
//         } else if (status.isFinalized) {
//           console.log(`Transaction for creating collection finalized in block ${status.asFinalized}`);
//         } else {
//           console.log(`Transaction status for creating collection: ${status}`);
//         }
//     });
      
//     await mintNFTTx.signAndSend(account, ({ status, events }) => {
//         if (status.isInBlock) {
//           console.log(`Transaction for minting NFT included in block ${status.asInBlock}`);
//           events.forEach(({ event: { method, data } }) => {
//             console.log(`Event: ${method} with data: ${data}`);
//           });
//         } else if (status.isFinalized) {
//           console.log(`Transaction for minting NFT finalized in block ${status.asFinalized}`);
//         } else {
//           console.log(`Transaction status for minting NFT: ${status}`);
//         }
//     });
  
//     console.log(`NFT minted with collection ID ${collectionId} and item ID ${itemId}`);
//   };
  
// export default mintNFT;
