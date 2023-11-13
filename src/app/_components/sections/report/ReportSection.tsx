// @ts-nocheck
"use client";

import React from "react";
import { useAtom } from "jotai";
import { finalReportAtom, isLoadingReportAtom } from "~/lib/state";
import ClipLoader from "react-spinners/ClipLoader";
import { MdOutlineContentCopy } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";

const ReportSection = () => {
  const [isLoadingReport] = useAtom(isLoadingReportAtom);
  const [finalReport] = useAtom(finalReportAtom);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalReport.email);
    setCopied(true);
  };

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  const isEmpty = Object.keys(finalReport).length === 0;

  if (isLoadingReport)
    return (
      <section
        id="report"
        className="mt-10 flex items-center justify-center md:h-[80vh]"
      >
        <ClipLoader />
      </section>
    );

  if (isEmpty) return null;

  return (
    <section id="report" className="rounded-2xl border bg-white p-8 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Final Accessibility Analysis
      </h2>
      <p
        className={`mb-6 inline-block text-lg font-bold ${
          // @ts-expect-error description
          finalReport.overall === "yes"
            ? "rounded-lg border border-green-300 bg-green-100 p-2 text-green-600"
            : // @ts-expect-error description
            finalReport.overall === "no"
            ? "rounded-lg border border-red-300 bg-red-100 p-2 text-red-600"
            : "rounded-lg border border-yellow-300 bg-yellow-100 p-2 text-yellow-600"
        }`}
      >
        Overall Assessment: {finalReport.overall}
      </p>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="mt-4 rounded-lg border bg-green-100 md:basis-1/2">
          <h3 className="mt-2 text-center text-lg font-bold text-green-600">
            Pros:
          </h3>
          <ul className="text-gray-700">
            {finalReport.pros.map((pro, index) => (
              <li
                key={index}
                className="list-none px-3 py-2 hover:bg-green-200"
              >
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 rounded-lg border bg-red-100 md:basis-1/2">
          <h3 className="mt-2 text-center text-lg font-bold text-red-600">
            Cons:
          </h3>
          <ul className="text-gray-700">
            {finalReport.cons.map((con, index) => (
              <li key={index} className="list-none px-3 py-2 hover:bg-red-200">
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-lg border bg-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h3 className="mb-2 text-lg font-bold">Email Inquiry Template:</h3>
          <div onClick={handleCopy} className="mb-3 cursor-pointer">
            {copied ? (
              <>
                <AiOutlineCheck className="inline-block h-6 w-7 text-green-500" />{" "}
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <MdOutlineContentCopy className="h-6 w-7 text-gray-500" />
            )}
          </div>
        </div>
        <textarea
          className="h-64 w-full rounded-lg border p-2"
          readOnly
          value={finalReport.email}
        />
      </div>
    </section>
  );
};

export default ReportSection;
