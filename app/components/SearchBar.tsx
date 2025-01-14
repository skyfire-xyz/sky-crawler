"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSkyfireAPIKey } from "@/lib/skyfire-sdk/context/context";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  onSearch: (url: string) => void;
  channelId?: string;
  inputDepth?: string;
  inputPayment?: string;
  ua?: string;
}

// Define the form schema with Zod
const searchFormSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL format")
    .regex(/^https?:\/\//, "URL must start with http:// or https://"),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://api-qa.skyfire.xyz";

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  channelId,
  inputDepth,
  inputPayment,
  ua,
}) => {
  const { localAPIKey } = useSkyfireAPIKey();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [useAPIKey, setUseAPIKey] = useState(true);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      url: "https://skyfire.xyz",
    },
  });

  const onSubmit = async (data: SearchFormValues) => {
    try {
      setIsLoading(true);
      setAlert(null);
      
      const crawlerEndpoint = backendURL + "/v1/crawler/start-crawl";
      const requestBody = {
        startUrl: data.url,
        ua: ua,
        channelId: channelId,
        ...(inputPayment !== "" && { inputCost: Number(inputPayment) }),
        ...(inputDepth !== "" && { inputDepth: Number(inputDepth) }),
      };

      const headers: Record<string, string> = {
        "content-type": "application/json",
      };
      
      if (useAPIKey) {
        headers["skyfire-api-key"] = localAPIKey;
      }

      await axios.post(crawlerEndpoint, requestBody, { headers });
      await onSearch(data.url);
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setAlert({
            type: 'INVALID',
            message: 'Invalid API Key',
          });
        } else if (err.message === "Network Error") {
          setAlert({
            type: 'NETWORK',
            message: 'Backend is unreachable',
          });
        } else {
          setAlert({
            type: 'INVALID',
            message: err.message,
          });
        }
      }
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex w-5/12 items-end space-x-2"
      >
        <div className="relative w-full">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 mb-0">
                  Website to crawl
                </FormLabel>
                <FormControl className="!mt-0">
                  <Input
                    {...field}
                    placeholder="Website to crawl"
                    aria-label="Website URL"
                  />
                </FormControl>
                {form.formState.errors.url && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.url.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="size-5 animate-spin"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <svg
                className="size-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            )}
            <span className="sr-only">Search</span>
          </button>
          <div className="flex items-center h-full">
            <Checkbox
              id="api-key-mode"
              checked={useAPIKey}
              onCheckedChange={setUseAPIKey}
            />
            <Label 
              htmlFor="api-key-mode" 
              className="text-nowrap text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              With API Key
            </Label>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SearchBar;
