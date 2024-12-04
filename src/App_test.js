//import { ConnectionDialog } from "dot-connect/react.js";
// import WalletConnect from "./components/WalletConnect.js";
import React, { useState } from "react";
import ImageGallery from "./components/ImageGallery";
import axios from "axios";
import logo from "./assets/art-hub-logo.png"; // Adjust the path based on your file location
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    editions: 1,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;
  const customGateway = "https://brown-managerial-quelea-388.mypinata.cloud/ipfs";

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
      alert("Please select a file to upload!");
      return;
    }

    try {
      setUploading(true);

      const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
      const data = new FormData();
      data.append("file", selectedFile);

      const response = await axios.post(url, data, {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
          "Content-Type": "multipart/form-data",
        },
      });

      const ipfsUrl = `${customGateway}/${response.data.IpfsHash}`;

      const newImage = {
        id: images.length + 1,
        src: ipfsUrl,
        name: formData.name,
        description: formData.description,
        editions: formData.editions,
      };
      setImages((prevImages) => [...prevImages, newImage]);

      setFormData({ name: "", description: "", editions: 1 });
      setSelectedFile(null);
      setUploading(false);
      setShowForm(false);
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      alert("File upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-left">
          <img src={logo} alt="Art Hub Logo" className="app-logo" />
          <h1 className="app-title">Art Hub</h1>
        </div>
        <button className="create-button" onClick={() => setShowForm((prev) => !prev)}>
          Create
        </button>
      </div>
      {showForm && (
        <div className="form-modal">
          <form className="upload-form" onSubmit={handleSubmission}>
            {/* Form inputs here */}
          </form>
        </div>
      )}
      <ImageGallery images={images} />

      {/* const [open, setOpen] = useState(false); */}
      {/* <WalletConnect />; */}
    </div>
  );
}

export default App;
