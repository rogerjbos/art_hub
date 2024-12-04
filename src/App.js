import React, { useState, useEffect } from 'react';
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import axios from 'axios';
import ImageGallery from './components/ImageGallery';
import logo from './assets/art-hub-logo.png';
import './App.css';

function App() {
  const [images, setImages] = useState(() => {
    // Retrieve images from Local Storage when the app initializes
    const savedImages = localStorage.getItem('images');
    return savedImages ? JSON.parse(savedImages) : [];
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    editions: 1,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Save images to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem('images', JSON.stringify(images));
  }, [images]);

  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;
  const customGateway = 'https://brown-managerial-quelea-388.mypinata.cloud/ipfs';

  const changeHandler = (event) => {
    setSelectedFile(event.target?.files?.[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload!');
      return;
    }

    try {
      setUploading(true);

      const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
      const data = new FormData();
      data.append('file', selectedFile);

      const response = await axios.post(url, data, {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
          'Content-Type': 'multipart/form-data',
        },
      });

      const ipfsUrl = `${customGateway}/${response.data.IpfsHash}`;

      const newImage = {
        id: images.length + 1,
        src: ipfsUrl,
        name: formData.name,
        description: formData.description,
        editions: formData.editions,
        collectionId: '',
        itemId: '',
      };
      setImages((prevImages) => [...prevImages, newImage]);

      setFormData({ name: '', description: '', editions: 1 });
      setSelectedFile(null);
      setUploading(false);
      setShowForm(false);
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      alert('File upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleConnectWallet = async () => {
    if (walletAddress) {
      // If already connected, disconnect the wallet
      setWalletAddress(null);
      console.log('Wallet disconnected');
      return;
    }

    try {
      setError(null); // Clear previous errors

      const extensions = await web3Enable('Art Hub');
      if (extensions.length === 0) {
        throw new Error('No wallet extensions found or access denied.');
      }

      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found in the wallet.');
      }

      setWalletAddress(accounts[0].address); // Set wallet address
      console.log('Wallet connected:', accounts[0].address);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet.'); // Set error message
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-left">
          <img src={logo} alt="Art Hub Logo" className="app-logo" />
          <h1 className="app-title">Dot Art</h1>
        </div>
        <div className="header-right">
          <button className="create-button" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? 'Cancel create' : 'Create'}
          </button>
          <button onClick={handleConnectWallet} className="connect-button">
            {walletAddress ? `${walletAddress.slice(0, 6)}...` : 'Connect Wallet'}
          </button>
        </div>
      </div>
      <ImageGallery images={images} />
      {showForm && (
        <div className="form-modal">
        <div className="form-container">
          <h2>New Creation</h2>
          <form onSubmit={handleSubmission} className="form">
            <div className="form-group">
              <label htmlFor="file">Select File:</label>
              <input type="file" id="file" onChange={changeHandler} required />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="editions">Number of Editions:</label>
              <input
                type="number"
                id="editions"
                name="editions"
                value={formData.editions}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" disabled={uploading} className="submit-button">
                {uploading ? 'Uploading...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;










// function App() {
//   const [images, setImages] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     editions: 1,
//   });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [error, setError] = useState(null);

//   const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
//   const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;
//   const customGateway = 'https://brown-managerial-quelea-388.mypinata.cloud/ipfs';

//   const changeHandler = (event) => {
//     setSelectedFile(event.target?.files?.[0]);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmission = async (e) => {
//     e.preventDefault();

//     if (!selectedFile) {
//       alert('Please select a file to upload!');
//       return;
//     }

//     try {
//       setUploading(true);

//       const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
//       const data = new FormData();
//       data.append('file', selectedFile);

//       const response = await axios.post(url, data, {
//         headers: {
//           pinata_api_key: pinataApiKey,
//           pinata_secret_api_key: pinataSecretApiKey,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const ipfsUrl = `${customGateway}/${response.data.IpfsHash}`;

//       const newImage = {
//         id: images.length + 1,
//         src: ipfsUrl,
//         name: formData.name,
//         description: formData.description,
//         editions: formData.editions,
//       };
//       setImages((prevImages) => [...prevImages, newImage]);

//       setFormData({ name: '', description: '', editions: 1 });
//       setSelectedFile(null);
//       setUploading(false);
//       setShowForm(false);
//     } catch (error) {
//       console.error('Error uploading to Pinata:', error);
//       alert('File upload failed. Please try again.');
//       setUploading(false);
//     }
//   };

//   const handleConnectWallet = async () => {
//     try {
//       setError(null);

//       const extensions = await web3Enable('Dot Art');
//       if (extensions.length === 0) {
//         throw new Error('No wallet extensions found or access denied.');
//       }

//       const accounts = await web3Accounts();
//       if (accounts.length === 0) {
//         throw new Error('No accounts found in the wallet.');
//       }

//       setWalletAddress(accounts[0].address);
//     } catch (err) {
//       console.error('Error connecting wallet:', err);
//       setError(err.message || 'Failed to connect wallet.');
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="header">
//         <div className="header-left">
//           <img src={logo} alt="Art Hub Logo" className="app-logo" />
//           <h1 className="app-title">Art Hub</h1>
//         </div>
//         <div className="header-right">
//           <button className="create-button" onClick={() => setShowForm((prev) => !prev)}>
//             {showForm ? 'Close' : 'Create'}
//           </button>
//           <button onClick={handleConnectWallet} className="connect-button">
//             {walletAddress ? 'Connected' : 'Connect Wallet'}
//           </button>
//         </div>
//       </div>
//       <ImageGallery images={images} />
//       {showForm && (
//         <div className="form-modal">
//           <div className="form-container">
//             <h2>Add New Image</h2>
//             <form onSubmit={handleSubmission}>
//               <label>
//                 Select File:
//                 <input type="file" onChange={changeHandler} required />
//               </label>
//               <label>
//                 Name:
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Description:
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   required
//                 ></textarea>
//               </label>
//               <label>
//                 Number of Editions:
//                 <input
//                   type="number"
//                   name="editions"
//                   value={formData.editions}
//                   onChange={handleInputChange}
//                   required
//                   min="1"
//                 />
//               </label>
//               <div className="form-buttons">
//                 <button type="submit" disabled={uploading}>
//                   {uploading ? 'Uploading...' : 'Add'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

