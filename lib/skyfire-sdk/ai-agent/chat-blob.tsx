import React from "react"
import { Message } from "ai"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { MemoizedReactMarkdown } from "./markdown"

interface ChatBlobProps {
  message: Message
}

export default function ChatBlob({ message }: ChatBlobProps) {
  const isUser = message.role === "user"
  if (!message.content) return null
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-[100%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start`}
      >
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback>{isUser ? "U" : "AI"}</AvatarFallback>
          <AvatarImage
            src={isUser ? "/user-avatar.png" : "/ai-avatar.png"}
            alt={isUser ? "User Avatar" : "AI Avatar"}
          />
        </Avatar>
        <div
          className={`mx-2 p-3 rounded-lg ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "max-w-[calc(100%-50px)] bg-muted"
          } break-words`}
        >
          <MemoizedReactMarkdown>
            {message.role === "system"
              ? message.content.split("<data-response>")[0]
              : message.content}
          </MemoizedReactMarkdown>
        </div>
      </div>
    </div>
  )
}
