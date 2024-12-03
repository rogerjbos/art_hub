import React from "react";
import "./ImageGallery.css";

const ImageGallery = ({ images }) => {
  const handleCollect = (imageName) => {
    alert(`Collecting: ${imageName}`);
  };

  return (
    <div className="image-gallery">
      {images.map((image) => (
        <div key={image.id} className="image-card">
          <h3 className="image-name">{image.name}</h3>
          <img src={image.src} alt={image.name} className="image" />
          <p className="image-editions">Editions: {image.editions}</p>
          <p className="image-description">{image.description}</p>
          <button
            className="collect-button"
            onClick={() => handleCollect(image.name)}
          >
            Collect
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;

