import React, { useEffect, useState } from "react";
import axios from "axios";
import GalleryCard from "../components/GalleryCard";

const GalleryPage = () => {
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    // Function to fetch gallery data from the backend
    const fetchGalleries = async () => {
      try {
        const response = await axios.get("/galleries"); // Assuming your backend server is running on the same host as your frontend
        setGalleries(response.data);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      }
    };

    fetchGalleries();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center py-10">Gallery</h1>
      <div className="flex flex-wrap justify-center">
        {galleries.map((gallery, index) => (
          <GalleryCard key={index} gallery={gallery} />
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
