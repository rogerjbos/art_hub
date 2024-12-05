import React from "react";
import "./ImageGallery.css";
import { mintNFT, queryCollectionDetails } from './Mint';

// const ImageGallery = ({ images, setImages }) => {
//   const handleCollect = async (imageData) => {
//     try {
//       const { collectionId, itemId } = await mintNFT();
//       const updatedImage = {
//         ...imageData,
//         collectionId,
//         itemId,
//       };
//       setImages((prevImages) => [...prevImages, updatedImage]);
//       console.log(`NFT added: Collection ID ${collectionId}, Item ID ${itemId}`);
//     } catch (error) {
//       console.error('Error minting NFT:', error);
//     }
//   };

//   return (
//     <div className="image-gallery">
//       {images.map((image) => (
//         <div key={image.id} className="image-card">
//           <h3 className="image-name">{image.name}</h3>
//           <img src={image.src} alt={image.name} className="image" />
//           <p className="image-editions">Editions: {image.editions}</p>
//           <p className="image-description">{image.description}</p>
//           <button
//             className="collect-button"
//             onClick={() => handleCollect(image)}
//           >
//             Collect
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ImageGallery;


const ImageGallery = ({ images }) => {
  const handleCollect = (imageName) => {

    mintNFT().catch(console.error);
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

