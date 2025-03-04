import { MessageData } from "../types"

const PaymentLog = ({
  payments,
  receipts,
}: {
  payments: MessageData[]
  receipts: MessageData[]
}) => (
  <div className="h-[calc(100vh-625px)]">
    <div className="h-full rounded-lg border border-[hsl(var(--payment-border))] bg-[hsl(var(--payment-bg))] text-[hsl(var(--payment-text))] p-4 flex flex-col">
      <h2 className="mb-2 text-xl font-bold">Payment Protocol Logs</h2>

      <ul className="overflow-y-auto flex-1">
        {payments.concat(receipts).map((log, index) => (
          <li key={index} className="mb-1.5 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-col">
                {log.type === "payment" ? (
                  <span>
                    <span className="text-yellow-300 dark:text-yellow-300">
                      {log.senderUsername}
                    </span>{" "}
                    <span className="text-cyan-500 dark:text-cyan-300">
                      paid {log.amount} USD to{" "}
                    </span>
                    <span className="text-pink-500 dark:text-pink-300">
                      {log.receiverUsername}
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="text-lime-500 dark:text-green-300">
                      {log.senderUsername}
                    </span>{" "}
                    <span className="text-cyan-500 dark:text-cyan-300">
                      paid {log.amount} USD to{" "}
                    </span>
                    <span className="text-yellow-300 dark:text-yellow-300">
                      {log.receiverUsername}
                    </span>
                  </span>
                )}
                {log.type === "payment" && (
                  <div className="flex items-center">
                    <span className="mr-3 text-xs text-cyan-500">
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
  </div>
)

export default PaymentLog
