import React from "react";

type Props = {
  description: string;
};

const Description = ({ description }: Props) => {
  return (
    <div className="basis-1/2">
      <div className="no-scrollbar rounded-md border border-rose-200 p-5">
        <div className="flex flex-col">
          <h2 className="text-center font-bold text-rose-500">Description</h2>

          <div className="mt-5 h-[450px] overflow-y-auto text-justify">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
