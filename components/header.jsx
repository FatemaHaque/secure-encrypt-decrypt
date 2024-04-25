"use client";
import React from "react";
import Logout from "./logout";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ name }) {
  const pathname = usePathname();

  return (
    <div className="bg-gray-300 w-full flex items-center justify-between py-6 px-12">
      <h4 className={`${pathname == "/posts" ? "text-3xl" : "text-xl"} `}>
        {name}
      </h4>

      <div className="flex gap-8">
        <Link
          href={`${
            (pathname == "/" && "/posts") || (pathname == "/posts" && "/")
          } `}
          className="bg-yellow-300 p-2 hover:bg-yellow-600 hover:text-white duration-300 "
        >
          {(pathname == "/" && "See your posts") ||
            (pathname == "/posts" && "Home")}
        </Link>
        <Logout />
      </div>
    </div>
  );
}
