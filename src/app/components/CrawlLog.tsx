import ShowTextButton from "./ShowTextButton";
import { MessageData } from "../types";

const CrawlLog = ({ log }: { log: MessageData[] }) => (
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
              <div className="flex items-center">
                <span className="mr-3 text-xs text-[#0D7490]">
                  [{entry.paid}]
                </span>
                <span className="mr-3 text-xs text-gray-500 dark:text-gray-300">
                  Characters: {entry.char}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  ({entry.time}ms)
                </span>
              </div>
            </div>
          </div>
          <ShowTextButton text={entry.text} />
        </li>
      ))}
    </ul>
  </div>
);

export default CrawlLog;
