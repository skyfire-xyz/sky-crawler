"use client"

import Image from "next/image"
import { X } from "lucide-react"

export default function TopBar() {
  return (
    <div className="flex w-full items-center justify-between bg-black p-2 text-white dark:bg-gray-200 dark:text-black">
      <Image
        src="/skyfire-logo.svg"
        alt="logo"
        width={103}
        height={24}
        className="mt-2 flex items-center"
      />
      <X className="mx-2 mt-2 size-6 text-white" />
      <Image
        src="/akamai-logo.png"
        alt="Akamai Logo"
        width={90}
        height={36}
        className="mt-0 flex items-center"
      />
      <div className="ml-auto flex items-center"></div>
    </div>
  )
}
