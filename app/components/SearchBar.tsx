"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { updateSkyfireAPIKey } from "@/lib/skyfire-sdk/context/action"
import {
  useSkyfire,
  useSkyfireAPIClient,
  useSkyfireAPIKey,
} from "@/lib/skyfire-sdk/context/context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Alert, AlertType } from "../types"

interface SearchBarProps {
  onSearch: () => void
  channelId?: string
  inputDepth?: string
  inputPayment?: string
  ua?: string
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
}

// Define the form schema with Zod
const searchFormSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL format")
    .regex(/^https?:\/\//, "URL must start with http:// or https://"),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api-qa.skyfire.xyz"

interface Suggestion {
  url: string
  type: string
}

const suggestions: Suggestion[] = [
  { url: "https://skyfire.xyz", type: "Free" },
  { url: "https://www.tinmoth.tech", type: "Free" },
  { url: "http://www.botscan.net", type: "Paid" },
]

if (process.env.NEXT_PUBLIC_APP_ENV !== "production") {
  suggestions.push({
    url: "https://api-qa.skyfire.xyz/v1/receivers/crawler-page?numLinks=10",
    type: "Test",
  })
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  channelId,
  inputDepth,
  inputPayment,
  ua,
  setAlerts,
}) => {
  const { localAPIKey, isReady } = useSkyfireAPIKey()
  const { apiClient } = useSkyfire()
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState("")
  const { dispatch } = useSkyfire()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      url: "",
    },
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          form.setValue("url", suggestions[selectedIndex].url)
          setIsFocused(false)
          setSelectedIndex(-1)
        }
        break
      case "Escape":
        setIsFocused(false)
        setSelectedIndex(-1)
        break
    }
  }

  const onSubmit = async (data: SearchFormValues) => {
    setIsFocused(false)
    await onSearch()
    try {
      setIsLoading(true)
      setAlerts([])

      const crawlerEndpoint = backendURL + "/v1/crawler/start-crawl"
      const requestBody = {
        startUrl: data.url,
        ua: ua,
        channelId: channelId,
        ...(inputPayment &&
          inputPayment !== "" && { inputCost: Number(inputPayment) }),
        ...(inputDepth &&
          inputDepth !== "" && { inputDepth: Number(inputDepth) }),
      }

      const headers: Record<string, string> = {
        "content-type": "application/json",
      }

      if (localAPIKey) {
        headers["skyfire-api-key"] = localAPIKey
      }

      if (localAPIKey && apiClient) {
        await apiClient.post(crawlerEndpoint, requestBody, { headers })
      } else {
        await axios.post(crawlerEndpoint, requestBody, { headers })
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setAlerts([
            {
              type: AlertType.INVALID,
              message: "Invalid API Key",
            },
          ])
        } else if (err.message === "Network Error") {
          setAlerts([
            {
              type: AlertType.NETWORK,
              message: "Backend is unreachable",
            },
          ])
        } else {
          setAlerts([
            {
              type: AlertType.INVALID,
              message: err.message,
            },
          ])
        }
      }
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiKeySave = () => {
    dispatch(updateSkyfireAPIKey(apiKeyInput))
    setIsPopoverOpen(false)
  }

  const handleApiKeyCancel = () => {
    setApiKeyInput("")
    setIsPopoverOpen(false)
  }

  const maskApiKey = (key: string) => {
    if (!key) return ""
    return `${key.slice(0, 4)}...${key.slice(-4)}`
  }

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open)
    if (open) {
      setApiKeyInput("") // Clear input when popover opens
    }
  }

  return (
    <Form {...form}>
      <form className="flex w-full max-w-3xl flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
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
                        onBlur={() =>
                          setTimeout(() => setIsFocused(false), 200)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Enter website URL"
                        autoComplete="off"
                      />
                      {isFocused && (
                        <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={suggestion.url}
                              className={`px-3 py-2 cursor-pointer ${
                                index === selectedIndex
                                  ? "bg-gray-100"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                field.onChange(suggestion.url)
                                setIsFocused(false)
                                setSelectedIndex(-1)
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
                  <div className="absolute top-8 text-sm">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="button"
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isLoading}
            variant="secondary"
          >
            {isLoading ? "Crawling..." : "Crawl"}
          </Button>

          <div className="flex items-center space-x-2">
            <Popover
              open={isPopoverOpen}
              onOpenChange={handlePopoverOpenChange}
            >
              <PopoverTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                  {localAPIKey ? (
                    <>
                      <span className="text-sm text-gray-600">
                        {maskApiKey(localAPIKey)}
                      </span>
                      <Pencil className="h-4 w-4 text-gray-400" />
                    </>
                  ) : (
                    <span className="text-sm text-blue-600">Set API Key</span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white border">
                <div className="flex flex-col space-y-4 p-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="api-key"
                      className="text-gray-900 font-medium"
                    >
                      API Key
                    </Label>
                    {localAPIKey && (
                      <div className="text-sm text-gray-500 mb-2">
                        Current: {maskApiKey(localAPIKey)}
                      </div>
                    )}
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Enter new API Key"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleApiKeySave}
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleApiKeyCancel}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default SearchBar
