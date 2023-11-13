"use client";

import React from "react";
import Description from "./Description";
import Images from "./Images";
import {
  descriptionAtom,
  imageUrlsAtom,
  isLoadingAnalysisAtom,
  isLoadingPropertyAtom,
  visualAnalysisAtom,
} from "~/lib/state";
import { useAtom } from "jotai";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

const PropertySection = () => {
  const [description] = useAtom(descriptionAtom);
  const [imageUrls] = useAtom(imageUrlsAtom);

  const [isLoadingProperty] = useAtom(isLoadingPropertyAtom);
  const [, setIsLoadingAnalysis] = useAtom(isLoadingAnalysisAtom);

  const [, setVisualAnalysis] = useAtom(visualAnalysisAtom);

  const handlePerformAnalysis = async () => {
    setIsLoadingAnalysis(true);

    const element = document.getElementById("analysis");
    // log the element to see what it looks like
    console.log(element);
    element?.scrollIntoView({ behavior: "smooth" });

    try {
      const data: {
        data: {
          accessible: string;
          accessibility_issues: {
            image_url: string;
            issues: {
              severity: string;
              description: string;
            }[];
          }[];
        };
      } = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/analyze-images",
        {
          image_urls: imageUrls,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setVisualAnalysis(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  if ((!description || !imageUrls) && !isLoadingProperty)
    return (
      <section id="property" className="flex items-center justify-center ">
        <h2 className="mx-10 text-center text-2xl font-semibold text-gray-500">
          No data available, please enter an Airbnb property URL
        </h2>
      </section>
    );

  if (isLoadingProperty)
    return (
      <section id="property" className="flex items-center justify-center">
        <ClipLoader />
      </section>
    );

  return (
    <section
      id="property"
      className="rounded-2xl border bg-white p-8 shadow-md"
    >
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <Description description={description} />
          <Images imageUrls={imageUrls} />
        </div>
        <button
          onClick={handlePerformAnalysis}
          className="flex-none rounded-md bg-rose-500 px-3 py-1 font-semibold text-white hover:bg-rose-600 active:bg-rose-700"
        >
          Perform accessibility analysis
        </button>
      </div>
    </section>
  );
};

export default PropertySection;
