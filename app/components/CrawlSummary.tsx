import { MessageData } from "../types"

interface CrawlSummaryProps {
  summary: MessageData | undefined
}

const CrawlSummary = ({ summary }: CrawlSummaryProps) => {

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

  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
      <h2 className="mb-3 text-lg font-bold dark:text-white">Crawl Summary</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pages Crawled
          </p>
          <p className="font-bold text-gray-900 dark:text-white">
            {summary?.totalPagesCrawled || "---"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Size</p>
          <p className="font-bold text-gray-900 dark:text-white">
            {summary?.totalTraversalSizeBytes 
              ? formatBytes(summary.totalTraversalSizeBytes)
              : "---"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Time</p>
          <p className="font-bold text-gray-900 dark:text-white">
            {summary?.totalTimeSeconds 
              ? formatTime(summary.totalTimeSeconds)
              : "---"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CrawlSummary
