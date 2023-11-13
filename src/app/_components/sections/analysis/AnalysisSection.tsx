// @ts-nocheck
"use client";

import React from "react";
import VisualAnalysis from "../analysis/VisualAnalysis";
import { useAtom } from "jotai";
import {
  descriptionAtom,
  finalReportAtom,
  isLoadingAnalysisAtom,
  isLoadingReportAtom,
  visualAnalysisAtom,
} from "~/lib/state";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

const AnalysisSection = () => {
  const [visualAnalysis] = useAtom(visualAnalysisAtom);
  const [description] = useAtom(descriptionAtom);
  const [isLoadingAnalysis] = useAtom(isLoadingAnalysisAtom);
  const [, setIsLoadingReport] = useAtom(isLoadingReportAtom);
  const [, setFinalReport] = useAtom(finalReportAtom);

  const handleFinalReport = async () => {
    setIsLoadingReport(true);

    const element = document.getElementById("report");
    // log the element to see what it looks like
    console.log(element);
    element?.scrollIntoView({ behavior: "smooth" });

    try {
      const data: {
        data: {
          overall: string;
          pros: string[];
          cons: string[];
          email: string;
        };
      } = await axios.post(
        "http://localhost:5000/accessibility-analysis",
        {
          image_analysis: visualAnalysis,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setFinalReport(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingReport(false);
    }
  };

  const isEmpty = Object.keys(visualAnalysis).length === 0;

  if (isLoadingAnalysis)
    return (
      <section id="property" className="flex items-center justify-center">
        <ClipLoader />
      </section>
    );

  if (isEmpty) return null;

  return (
    <section
      id="analysis"
      className="rounded-2xl border bg-white p-8 shadow-md"
    >
      <div className="flex flex-col items-center justify-center gap-8 p-10">
        <div className="flex flex-col gap-5">
          <div className="text-center font-bold text-gray-500">
            Visual Analysis Result
          </div>
          <div className="text-center text-gray-500">
            Accessible:{" "}
            <span
              className={`rounded-md border px-3 py-1 ${
                visualAnalysis.accessible === "unsure" &&
                "border-yellow-500 bg-yellow-100  text-yellow-500"
              } ${
                visualAnalysis.accessible === "true" &&
                "border-green-500 bg-green-100  text-green-500"
              } ${
                visualAnalysis.accessible === "false" &&
                "border-red-500 bg-red-100  text-red-500"
              }`}
            >
              {visualAnalysis.accessible}
            </span>
          </div>
        </div>
        <VisualAnalysis issues={visualAnalysis.accessibility_issues} />
        <button
          onClick={handleFinalReport}
          className="flex-none rounded-md bg-rose-500 px-3 py-1 font-semibold text-white hover:bg-rose-600 active:bg-rose-700"
        >
          Get final report
        </button>
      </div>
    </section>
  );
};

export default AnalysisSection;
