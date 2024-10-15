"use client";
import { X } from "lucide-react";
import Image from "next/image";

export default function TopBar() {
  return (
    <div className="flex w-full items-center justify-between bg-black p-2 text-white dark:bg-gray-200 dark:text-black">
      <img
        src="/favicon.svg"
        alt="LearnerBot Logo"
        className="ml-4 h-10 w-10"
      />
      <h1 className="font-teko ml-2 mt-2 flex items-center text-4xl font-normal text-gray-300 dark:text-gray-600">
        LearnerBot
      </h1>
      <X className="mx-2 mt-2 h-6 w-6 text-white" />
      <Image
        src="/skyfire-logo.svg"
        alt="logo"
        width={103}
        height={24}
        className="mt-2 flex items-center"
      />
      <div className="ml-auto flex items-center"></div>
    </div>
  );
}
