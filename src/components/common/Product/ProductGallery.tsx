"use client";

import MyImage from "@/components/shared/Ui/Image/MyImage";
import Image from "next/image";
import { useEffect, useState } from "react";

// const images = [
//   "https://i.ibb.co/wH5m9MW/tomato1.png",
//   "https://i.ibb.co/TM2hLFGG/tomato3.png",
//   "https://i.ibb.co/4Z8j2X0f/tomato2.png",
//   "https://i.ibb.co/pjRLPnzQ/tomato4.png",
//   "https://i.ibb.co/tNxCmdh/tomato5.png",
// ];

const ProductGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // start fade-out

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(false); // fade-in after image change
      }, 500);
    }, 4000); // change every 4s

    return () => clearInterval(interval);
  }, [images.length]);

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-white dark:bg-deep-dark rounded-2xl overflow-hidden shadow-cardLightShadow dark:shadow-cardDarkShadow">
        <MyImage
          src={images[currentIndex]}
          alt={`Product ${currentIndex + 1}`}
          width={600}
          height={600}
          className={`w-full object-cover transition-opacity duration-500 ${
            fade ? "opacity-80" : "opacity-100"
          }`}
        />
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((img: string, index: number) => (
          <div
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
              index === currentIndex
                ? "border-primary/80"
                : "border-transparent hover:border-primary/80"
            }`}
          >
            <Image
              src={img}
              width={100}
              height={90}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
