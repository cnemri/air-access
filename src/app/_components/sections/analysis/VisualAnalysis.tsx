import React from "react";

type Props = {
  issues: {
    image_url: string;
    issues: {
      severity: string;
      description: string;
    }[];
  }[];
};

const VisualAnalysis = ({ issues }: Props) => {
  return (
    <div className="container mx-auto h-[450px]">
      <div className="flex max-h-full flex-wrap place-content-start items-start justify-center gap-5 overflow-y-auto">
        {issues.map((issue, index) => (
          <div
            key={index}
            className="flex h-96 max-w-sm flex-col items-start overflow-y-auto rounded-md border p-5 shadow-md"
          >
            <img
              src={issue.image_url}
              className="aspect-square w-48 rounded-md object-cover"
            />
            <div className="text-gray-500">
              {issue.issues.map((issue, issue_idx) => (
                <div key={issue_idx} className="flex flex-col gap-4 py-4">
                  <div
                    className={`${
                      issue.severity === "high"
                        ? "text-red-600"
                        : issue.severity === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    Severity: {issue.severity}
                  </div>
                  <div className="">Description: {issue.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualAnalysis;
