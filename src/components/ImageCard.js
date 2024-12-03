import React from "react";
import "./ImageCard.css";

const ImageCard = ({ src, alt }) => {
  const handleMint = () => {
    alert(`Minting image: ${alt}`);
    // Add your minting logic here
  };

  return (
    <div className="image-card">
      <img src={src} alt={alt} className="image" />
      <button className="mint-button" onClick={handleMint}>
        Mint
      </button>
    </div>
  );
};

export default ImageCard;
