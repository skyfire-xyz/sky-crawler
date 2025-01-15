import { useRouter } from "next/router"
import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  useSkyfireReceivers,
  useSkyfireRuleById,
  useSkyfireState,
} from "../context/context"
import { FREQUENCY_TYPES, Receiver } from "../context/type"

interface ChatErrorMessageProps {
  errorMessage: {
    message: string
    data: {
      ruleId: string
    }
  }
}

interface ChatGeneralProps {
  direction: "left" | "right"
  textMessage?: string
  contentImageUrl?: string
  children?: React.ReactNode
  ruleId: string
}

function ChatUserRoleError({ ruleId }: { ruleId: string }) {
  const rule = useSkyfireRuleById(ruleId)
  const receivers = useSkyfireReceivers()
  if (!rule) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Payment amount exceeds your spending limit rule</AlertTitle>
      <AlertDescription>
        {rule && (
          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md">
            <div className="text-sm text-gray-600">
              <b>Rule:</b> <b>${rule.amount} USD</b> (
              {rule.type === "TRANSACTION"
                ? "Per Transaction"
                : FREQUENCY_TYPES[rule.frequency!].displayName}
              ) for {rule.targetWalletAddress}
              {rule.targetWalletAddress
                ? receivers?.find(
                    (r: Receiver) =>
                      r.walletAddress === rule.targetWalletAddress
                  )?.username || "Unknown"
                : "All Providers"}
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

export default function ChatErrorMessage({
  errorMessage,
}: ChatErrorMessageProps) {
  if (errorMessage?.data) {
    if (errorMessage.data.ruleId) {
      return <ChatUserRoleError ruleId={errorMessage.data.ruleId} />
    }
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{errorMessage.message}</AlertDescription>
    </Alert>
  )
}
