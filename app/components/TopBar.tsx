"use client"

import Image from "next/image"
import { X } from "lucide-react"

import { useClientConfig } from "@/lib/client-context"

export default function TopBar() {
  const clientConfig = useClientConfig()

  console.log(clientConfig, "????")

  return (
    <div className="flex w-full items-center justify-between p-2 bg-[hsl(var(--topbar-bg))] text-[hsl(var(--topbar-text))]">
      <Image
        src={clientConfig.skyfireLogo}
        alt="logo"
        width={103}
        height={24}
        className="mt-2 flex items-center"
      />
      {clientConfig.logo && (
        <>
          <X className="mx-2 mt-2 size-6 text-[hsl(var(--topbar-text))]" />
          <Image
            src={clientConfig.logo}
            alt={`${clientConfig.name} Logo`}
            width={clientConfig.logoSize?.width || 90}
            height={clientConfig.logoSize?.height || 36}
            className={`mt-[var(--topbar-logo)] flex items-center`}
          />
        </>
      )}
      <div className="ml-auto flex items-center"></div>
    </div>
  )
}
