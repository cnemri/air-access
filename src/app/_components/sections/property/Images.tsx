"use client";
import React from "react";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

type Props = {
  imageUrls: string[];
};

const Images = ({ imageUrls }: Props) => {
  const numImages = imageUrls.length;
  const [currentImage, setCurrentImage] = React.useState(0);
  const handleNext = () => {
    setCurrentImage((currentImage) => (currentImage + 1) % numImages);
  };

  const handlePrevious = () => {
    setCurrentImage((currentImage) => {
      if (currentImage === 0) return numImages - 1;
      return currentImage - 1;
    });
  };

  return (
    <div className="flex basis-1/2 flex-col items-center justify-center gap-10">
      <img
        className="aspect-video h-56 rounded-2xl bg-gray-100 object-contain object-center md:h-72"
        src={imageUrls[currentImage]}
      />
      <div className="mx-10 flex space-x-10">
        <button onClick={handlePrevious}>
          <AiFillLeftCircle className="inline-block h-6 w-6 text-gray-500" />
        </button>
        <div className="no-scrollbar flex h-32 max-w-md flex-wrap place-content-start items-start justify-center gap-2 overflow-y-auto">
          {imageUrls.map((imageUrl, index) => (
            <img
              key={index}
              className={`aspect-square  h-16 rounded-md object-cover ${
                index === currentImage ? "border-2 border-rose-500" : ""
              }`}
              src={imageUrl}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
        <button onClick={handleNext}>
          <AiFillRightCircle className="inline-block h-6 w-6 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Images;
