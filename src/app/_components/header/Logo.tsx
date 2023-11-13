"use client";

import { useAtom } from "jotai";
import React from "react";
import { BiAccessibility } from "react-icons/bi";
import {
  descriptionAtom,
  finalReportAtom,
  imageUrlsAtom,
  visualAnalysisAtom,
} from "~/lib/state";

const Logo = () => {
  const [, setDescription] = useAtom(descriptionAtom);
  const [, setImageUrls] = useAtom(imageUrlsAtom);
  const [, setVisualAnalysis] = useAtom(visualAnalysisAtom);
  const [, setFinalReport] = useAtom(finalReportAtom);
  return (
    <div className="flex basis-1/4 items-center justify-center">
      <div
        onClick={() => {
          setDescription("");
          setImageUrls([]);
          setVisualAnalysis({});
          setFinalReport({});
        }}
        className="cursor-pointer text-xs text-rose-500 md:text-base"
      >
        <BiAccessibility className="mr-2 inline-block h-10 w-10" />
        <span className="font-bold uppercase tracking-wider">
          AirAccess&trade;
        </span>
      </div>
    </div>
  );
};

export default Logo;
