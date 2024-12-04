import { defineConfig } from "@reactive-dot/core";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";
import { registerDotConnect } from "dot-connect";

export const config = defineConfig({
  wallets: [
    new InjectedWalletProvider(), // Configure Polkadot.js wallet support
  ],
});

// Register DOTConnect custom elements
registerDotConnect({
  wallets: config.wallets,
});


// import { defineConfig } from "@reactive-dot/core";
// import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";
// import { registerDotConnect } from "dot-connect";

// export const config = defineConfig({
//   wallets: [
//     new InjectedWalletProvider(), // Add support for Polkadot.js wallet
//   ],
// });

// // Register dot-connect custom elements & configure supported wallets
// registerDotConnect({
//   wallets: config.wallets,
// });
