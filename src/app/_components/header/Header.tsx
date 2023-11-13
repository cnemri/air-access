"use client";

import React from "react";
import Logo from "./Logo";
import Search from "./Search";

const Header = () => {
  return (
    <div className="flex border-b-[1px] border-b-neutral-200 py-2">
      <Logo />
      <Search />
    </div>
  );
};

export default Header;
