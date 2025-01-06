import { useState } from "react";
import DepthInput from "./DepthInput";
import PaymentInput from "./PaymentInput";
import UserAgentSettingsInput from "./UserAgentSettingsInput";
import { FaCog, FaPlus } from "react-icons/fa";

interface SettingsBarProps {
  onDepthChange: (newDepth: string) => void;
  onPaymentChange: (newPayment: string) => void;
  onUAChange: (newUA: string) => void;
}

export default function SettingsBar({
  onDepthChange,
  onPaymentChange,
  onUAChange,
}: SettingsBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [depth, setDepth] = useState<string | null>(null);
  const [payment, setPayment] = useState("");
  const [userAgent, setUserAgent] = useState("");
  const [isDepthDropdownOpen, setIsDepthDropdownOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isUserAgentDropdownOpen, setIsUserAgentDropdownOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleDepthDropdown = () => {
    setIsDepthDropdownOpen(!isDepthDropdownOpen);
  };

  const togglePaymentDropdown = () => {
    setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
  };

  const toggleUserAgentDropdown = () => {
    setIsUserAgentDropdownOpen(!isUserAgentDropdownOpen);
  };

  const handleDepthChange = (newDepth: string) => {
    setDepth(newDepth);
    onDepthChange(newDepth);
  };

  const handlePaymentChange = (newPayment: string) => {
    setPayment(newPayment);
    onPaymentChange(newPayment);
  };

  const handleUserAgentChange = (newUA: string) => {
    setUserAgent(newUA);
    onUAChange(newUA);
  };

  return (
    <div className="relative">
      <div className="text-center">
        <FaCog
          size={40}
          className="text-gray-600 hover:text-gray-800"
          onClick={toggleDrawer}
        />
      </div>

      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={toggleDrawer}
        />
      )}

      {/* Drawer Component */}
      <div
        className={`fixed right-0 top-0 z-40 h-screen overflow-y-auto p-4 transition-transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } w-80 bg-white dark:bg-gray-800`}
        aria-labelledby="drawer-right-label"
      >
        <h5
          id="drawer-right-label"
          className="mb-4 inline-flex items-center text-base font-semibold text-gray-700 dark:text-gray-400"
        >
          <svg
            className="size-6 text-gray-700 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4"
            />
          </svg>
          Crawl Settings
        </h5>
        <button
          type="button"
          onClick={toggleDrawer}
          className="absolute right-2.5 top-2.5 inline-flex size-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="size-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <p className="mb-6 text-sm text-gray-700 dark:text-gray-400">
          Customize your crawl here.
        </p>
        <div>
          <button
            type="button"
            className="group flex w-full items-center rounded-lg p-2 text-base text-gray-700 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            onClick={toggleUserAgentDropdown}
          >
            <span className="flex-1 whitespace-nowrap text-left rtl:text-right">
              Custom User Agent
            </span>
            <svg
              className={`size-3 transition-transform ${isUserAgentDropdownOpen ? "rotate-180" : "rotate-0"}`} // Rotate icon based on dropdown state
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {isUserAgentDropdownOpen && (
            <ul className="space-y-2 py-2">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Sets the User Agent the Crawler should use to crawl pages.
              </p>
              <UserAgentSettingsInput
                value={userAgent}
                onChange={handleUserAgentChange}
              />
            </ul>
          )}
        </div>{" "}
        <div>
          <button
            type="button"
            className="group flex w-full items-center rounded-lg p-2 text-base text-gray-700 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            onClick={toggleDepthDropdown}
          >
            <span className="flex-1 whitespace-nowrap text-left rtl:text-right">
              Maximum Depth
            </span>
            <svg
              className={`size-3 transition-transform ${isDepthDropdownOpen ? "rotate-180" : "rotate-0"}`} // Rotate icon based on dropdown state
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {isDepthDropdownOpen && (
            <ul className="space-y-2 py-2">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                This defines how many levels of links the crawler will follow
                from the start URL. For example, a depth of 1 means only the
                direct links from the start URL will be followed.
              </p>
              <DepthInput value={depth} onChange={handleDepthChange} />
            </ul>
          )}
        </div>
        <div>
          <button
            type="button"
            className="group flex w-full items-center rounded-lg p-2 text-base text-gray-700 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            onClick={togglePaymentDropdown}
          >
            <span className="flex-1 whitespace-nowrap text-left rtl:text-right">
              Maximum Payment
            </span>
            <svg
              className={`size-3 transition-transform ${isPaymentDropdownOpen ? "rotate-180" : "rotate-0"}`} // Rotate icon based on dropdown state
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {isPaymentDropdownOpen && (
            <ul className="space-y-2 py-2">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                This is the maximum amount the crawler will pay to access a
                specific folder or section of a website. It ensures the crawler
                doesn’t spend more than this limit when gathering information.
              </p>
              <PaymentInput value={payment} onChange={handlePaymentChange} />
            </ul>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4"></div>
      </div>
    </div>
  );
}
