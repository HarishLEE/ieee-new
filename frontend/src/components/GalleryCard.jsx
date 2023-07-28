import React, { useState } from "react";

const GalleryCard = ({ gallery }) => {
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  const [currentImage, setCurrentImage] = useState(0);

  const handleNextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % gallery.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === 0 ? gallery.images.length - 1 : prevImage - 1
    );
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
      {/* Event Images */}
      <div className="relative">
        <img
          src={gallery.images[currentImage]}
          alt={`${gallery.title} - Image ${currentImage + 1}`}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full">
          <button
            onClick={handlePrevImage}
            className="bg-gray-800 bg-opacity-50 text-white px-2 py-1 rounded-l"
          >
            &lt;
          </button>
          <button
            onClick={handleNextImage}
            className="bg-gray-800 bg-opacity-50 text-white px-2 py-1 rounded-r"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{gallery.title}</div>
        <p className="text-gray-700 text-base">{gallery.description}</p>
        {/* Event Date */}
        <p className="text-gray-600 mt-2">Date: {formatDate(gallery.date)}</p>
      </div>
    </div>
  );
};

export default GalleryCard;
