"use client"

import "./skyfire-theme.css"
import React, { useEffect, useState } from "react"
import { useChat } from "ai/react"
import { AnimatePresence, motion } from "framer-motion"

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  useLoadingState,
  useSkyfire,
  useSkyfireAPIKey,
  useSkyfireState,
  useSkyfireTOSAgreement,
} from "../context/context"
import { Toaster } from "../custom-shadcn/ui/toaster"
import { usdAmount } from "../util"
import { ApiKeyConfig } from "./api-key-config"
import { APIKeyConfigWithTOS } from "./api-key-config-with-tos"
import LoadingImageWidget from "./loadingImage"
import { WalletInterface } from "./wallet"

interface TOSObject {
  name: string
  tos?: string
  link?: string
}

interface SkyfireWidgetProps {
  tos?: TOSObject
}

export default function SkyfireWidget({ tos }: SkyfireWidgetProps) {
  const { localAPIKey, isReady } = useSkyfireAPIKey()
  const { tosAgreed } = useSkyfireTOSAgreement()
  const { getClaimByReferenceID } = useSkyfire()
  const [errorMessage, setErrorMessage] = useState<{
    message: string
    data: any
  } | null>(null)
  const aiChatProps = useChat({
    headers: {
      "skyfire-api-key": localAPIKey || "",
    },
    onResponse: (response: Response) => {
      const paymentReferenceId = response.headers.get(
        "skyfire-payment-reference-id"
      )
      getClaimByReferenceID(paymentReferenceId)
    },
    onError: (error: Error) => {
      let data
      if (error.message.includes("Payment amount exceeds")) {
        const match = error.message.match(/rule id: ([0-9a-f-]+)/)
        const ruleId = match ? match[1] : null
        data = {
          ruleId,
        }
      }
      setErrorMessage(
        { message: error.message, data: data } ||
          "An error occurred during the chat."
      )
    },
  })

  const { error } = useSkyfireState()

  const loading = useLoadingState()
  const { balance } = useSkyfireState()
  const [isDialogOpen, setIsDialogOpen] = useState(
    isReady && (!localAPIKey || (tos && !tosAgreed))
  )
  const [showWidget, setShowWidget] = useState(
    isReady && !!localAPIKey && (!tos || tosAgreed)
  )

  useEffect(() => {
    if (isReady) {
      if (localAPIKey && (!tos || tosAgreed)) {
        setIsDialogOpen(false)
        setShowWidget(true)
      } else {
        setIsDialogOpen(true)
        setShowWidget(false)
      }
    }
  }, [localAPIKey, tosAgreed, isReady, tos])

  const minimizedVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: 0,
      y: 0,
      right: "20px",
      bottom: "20px",
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      right: "20px",
      bottom: "20px",
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  }

  const ConfigComponent = tos ? APIKeyConfigWithTOS : ApiKeyConfig

  return (
    <div className="skyfire-theme">
      <Dialog open={isDialogOpen || !!error}>
        <DialogOverlay />
        <DialogContent className="skyfire-theme sm:max-w-[425px]">
          {tos ? (
            <APIKeyConfigWithTOS error={error} tos={tos} />
          ) : (
            <ApiKeyConfig error={error} />
          )}
        </DialogContent>
      </Dialog>
      {showWidget && (
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={`${
                localAPIKey && (!tos || tosAgreed) ? "visible" : "hidden"
              } rounded-full p-0 md:p-2 flex items-center fixed bg-[hsl(var(--primary))] z-[40] overflow-hidden cursor-pointer right-[10px] bottom-[10px] md:right-[20px] md:bottom-[20px]`}
            >
              <div className="flex items-center space-x-2 md:p-2 p-0">
                <LoadingImageWidget
                  src="https://imagedelivery.net/WemO4_3zZlyNq-8IGpxrAQ/9b7b7f1c-a4b7-4777-c7ff-c92b50865600/public"
                  alt="Company Logo"
                  size={50}
                  loading={!!loading}
                />
                <span className="hidden md:inline text-primary-foreground text-xl font-semibold">
                  {usdAmount(balance?.escrow.available || "0")}
                </span>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-full md:max-w-[800px] md:w-[800px] bg-transparent border-none p-0"
            align="end"
            side="top"
          >
            <WalletInterface
              aiChatProps={aiChatProps}
              errorMessage={errorMessage}
            />
          </PopoverContent>
        </Popover>
      )}
      <Toaster />
    </div>
  )
}
