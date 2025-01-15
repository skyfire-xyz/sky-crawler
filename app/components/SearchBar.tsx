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
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertType } from "../types";

interface SearchBarProps {
  onSearch: () => void;
  channelId?: string;
  inputDepth?: string;
  inputPayment?: string;
  ua?: string;
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
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

interface Suggestion {
  url: string;
  type: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  channelId,
  inputDepth,
  inputPayment,
  ua,
  setAlerts,
}) => {
  const { localAPIKey } = useSkyfireAPIKey();
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const suggestions: Suggestion[] = [
    { url: 'https://skyfire.xyz', type: 'Free' },
    { url: 'https://www.tinmoth.tech', type: 'Free' },
    { url: 'http://www.botscan.net', type: 'Paid' },
    { url: 'https://api-qa.skyfire.xyz/v1/receivers/crawler-page?numLinks=10', type: 'Test' },
  ];

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          form.setValue('url', suggestions[selectedIndex].url);
          setIsFocused(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const onSubmit = async (data: SearchFormValues, withApiKey: boolean) => {
    setIsFocused(false);
    await onSearch();
    try {
      setIsLoading(true);
      setAlerts([]);
      
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
      
      if (withApiKey && localAPIKey) {
        headers["skyfire-api-key"] = localAPIKey;
      }

      await axios.post(crawlerEndpoint, requestBody, { headers });
  
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setAlerts([{
            type: AlertType.INVALID,
            message: 'Invalid API Key',
          }]);
        } else if (err.message === "Network Error") {
          setAlerts([{
            type: AlertType.NETWORK,
            message: 'Backend is unreachable',
          }]);
        } else {
          setAlerts([{
            type: AlertType.INVALID,
            message: err.message,
          }]);
        }
      }
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(suggestions,'suggestions');

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data) => onSubmit(data, true))} 
        className="flex w-full max-w-3xl items-end space-x-2"
      >
        <div className="relative w-full">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter website URL"
                    />
                    {isFocused && (
                      <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={suggestion.url}
                            className={`px-3 py-2 cursor-pointer ${
                              index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              field.onChange(suggestion.url);
                              setIsFocused(false);
                              setSelectedIndex(-1);
                            }}
                          >
                            <div className="flex items-center justify-between">
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                {suggestion.type}
                              </span>
                              <div className="text-sm">{suggestion.url}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
            disabled={isLoading}
            variant="secondary"
          >
            {isLoading ? "Crawling..." : "Crawl with API Key"}
          </Button>
          <Button
            type="button"
            onClick={() => form.handleSubmit((data) => onSubmit(data, false))()}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Crawling..." : "Crawl without API Key"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SearchBar;
