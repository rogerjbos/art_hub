import React, { useState } from 'react';
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';

function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const handleConnectWallet = async () => {
    try {
      setError(null);

      // Request access to the wallet extension
      const extensions = await web3Enable('Dot Art');
      if (extensions.length === 0) {
        throw new Error('No wallet extensions found or access denied.');
      }

      // Retrieve wallet accounts
      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found in the wallet.');
      }

      // Use the first account
      setWalletAddress(accounts[0].address);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet.');
    }
  };

  return (
    <div className="wallet-connect-container">
      
      {walletAddress ? (
        <div className="wallet-info">
          <p>Connected Wallet</p>
          <p className="wallet-address">{walletAddress}</p>
        </div>
      ) : (
        <div>
          <button onClick={handleConnectWallet} className="connect-button">
            Connect Wallet
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default WalletConnect;

