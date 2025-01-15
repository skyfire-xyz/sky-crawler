import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  AlertDescription,
  AlertTitle,
  Alert as AlertUI,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

import { Alert, MessageData } from "../types"
import ShowTextButton from "./ShowTextButton"

type BadgeVariant = "default" | "success" | "destructive" | undefined

const getBadgeVariant = (status: string): BadgeVariant => {
  switch (status) {
    case "PAID":
      return "success"
    case "FREE":
      return "default"
    case "FAILED":
      return "destructive"
  }
}

const formatBytes = (bytes: string) => {
  const size = parseInt(bytes)
  if (size < 1024) return size + " B"
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB"
  return (size / (1024 * 1024)).toFixed(2) + " MB"
}

const formatTime = (seconds: string) => {
  const time = parseFloat(seconds)
  if (time < 1) return (time * 1000).toFixed(0) + "ms"
  return time.toFixed(2) + "s"
}

interface CrawlLogProps {
  log: MessageData[]
  summary?: MessageData
  errorMessages: Alert[]
}

export default function CrawlLog({
  log,
  summary,
  errorMessages,
}: CrawlLogProps) {
  return (
    <div className="w-1/2 space-y-4">
      <div className="grow rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
        <h2 className="mb-2 text-xl font-bold dark:text-white">
          Crawled Data Logs
        </h2>

        <ul>
          {log.map((entry, index) => (
            <li key={index} className="mb-1.5 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-col">
                  <span className="text-gray-800 dark:text-gray-400">
                    {entry.url}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getBadgeVariant(entry.paid)}
                      className="text-xs px-2 py-0.5"
                    >
                      {entry.paid}
                    </Badge>
                    {entry.paid !== "FAILED" && (
                      <>
                        <span className="mr-3 text-xs text-gray-500 dark:text-gray-300">
                          Characters: {entry.char}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-300">
                          ({entry.time}ms)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <ShowTextButton
                text={entry.text}
                filePath={entry.url.replace(/^https?:\/\//, "")}
              />
            </li>
          ))}
        </ul>

        {summary && summary.type === "summary" && (
          <div className="mt-4 border-t border-gray-300 pt-4 dark:border-gray-600">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pages Crawled
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {summary.totalPagesCrawled}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Size
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatBytes(summary.totalTraversalSizeBytes || "0")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Time
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatTime(summary.totalTimeSeconds || "0")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Display error messages at the top */}
        {errorMessages.map((error, index) => (
          <AlertUI variant="destructive" key={index} className="mt-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </AlertUI>
        ))}
      </div>
    </div>
  )
}
