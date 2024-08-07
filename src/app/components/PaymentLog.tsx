import { MessageData } from "../types";

const PaymentLog = ({
  payments,
  receipts,
}: {
  payments: MessageData[];
  receipts: MessageData[];
}) => (
  <div className="w-1/3 rounded-lg border border-blue-800 bg-gray-900 p-4 text-white dark:border-gray-300 dark:bg-white dark:text-gray-900">
    <h2 className="mb-2 text-xl font-bold">Payment Protocol Logs</h2>
    <ul>
      {payments.concat(receipts).map((log, index) => (
        <li key={index} className="mb-1.5 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-col">
              {log.type === "payment" ? (
                <span className="text-cyan-500 dark:text-blue-300">
                  {log.senderUsername} paid {log.amount} USD to{" "}
                  {log.receiverUsername}
                </span>
              ) : (
                <span className="text-lime-500 dark:text-green-400">
                  {log.senderUsername} paid {log.amount} USD to{" "}
                  {log.receiverUsername}
                </span>
              )}
              {log.type === "payment" && (
                <div className="flex items-center">
                  <span className="mr-3 text-xs text-gray-300">
                    Access granted to {log.path}
                  </span>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default PaymentLog;
