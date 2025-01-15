import React, { useState } from "react"

import { DEFAULT_USER_AGENT } from "../types"

interface UserAgentInputProps {
  value: string | null
  onChange: (newUserAgent: string) => void
}

const UserAgentSettingsInput: React.FC<UserAgentInputProps> = ({
  onChange: onUaChange,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    setInputValue(value)
    setError(null)
    onUaChange(value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form className="w-7/8" onSubmit={handleSubmit}>
      <label
        htmlFor="string-input"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      ></label>
      <input
        type="string"
        id="string-input"
        value={inputValue}
        onChange={handleChange}
        aria-describedby="helper-text-explanation"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder={`${DEFAULT_USER_AGENT}`}
        required
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </form>
  )
}

export default UserAgentSettingsInput
