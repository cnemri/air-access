import axios from "axios";
import { atom, useAtom } from "jotai";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  descriptionAtom,
  imageUrlsAtom,
  isLoadingPropertyAtom,
} from "~/lib/state";

const Search = () => {
  const [url, setUrl] = React.useState("");
  const [, setDescription] = useAtom(descriptionAtom);
  const [, setImageUrls] = useAtom(imageUrlsAtom);
  const [, setIsLoading] = useAtom(isLoadingPropertyAtom);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // look for description and image urls in the backend
      const data: { data: { description: string; image_urls: string[] } } =
        await axios.post(
          "/api/scrape",
          {
            property_url: url,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

      // destructuring
      const { description, image_urls } = data.data;
      setDescription(description);
      setImageUrls(image_urls);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex basis-3/4 items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-x-3 text-sm"
      >
        <label
          htmlFor="url"
          className="hidden flex-none font-semibold text-gray-500 md:block"
        >
          Airbnb URL
        </label>
        <div className="flex flex-auto space-x-3 rounded-md border px-3 py-1">
          <AiOutlineSearch className="inline h-6 w-6 text-gray-500" />
          <input
            type="text"
            id="url"
            placeholder="Enter an Airbnb URL ..."
            className="w-[100px] outline-none md:w-[300px]"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button className="flex-none rounded-md bg-rose-500 px-3 py-1 font-semibold text-white hover:bg-rose-600 active:bg-rose-700">
          Access property
        </button>
      </form>
    </div>
  );
};

export default Search;
