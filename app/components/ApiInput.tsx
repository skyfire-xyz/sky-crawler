import React, { useState } from "react"

interface ApiInputProps {
  onApiKeyChange: (apiKey: string) => void
}

const ApiInput: React.FC<ApiInputProps> = ({ onApiKeyChange }) => {
  const [inputValue, setInputValue] = useState("")
  const [isObsecured, setObsecured] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    onApiKeyChange(event.target.value)
  }

  const handleBlur = () => {
    if (inputValue.length > 4) {
      setObsecured(true)
    }
  }

  const handleFocus = () => {
    setObsecured(false)
  }

  const getObsecuredValue = () => {
    if (inputValue.length <= 4) return inputValue
    const lastFour = inputValue.slice(-4)
    const hiddenPart = "⏺".repeat(inputValue.length - 4)
    return `${hiddenPart}${lastFour}`
  }

  return (
    <form className="w-1/4">
      {" "}
      <div className="relative w-full">
        {" "}
        <input
          type="text"
          id="floating_outlined"
          className="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
          required
          value={isObsecured ? getObsecuredValue() : inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        <label
          htmlFor="floating_outlined"
          className="absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          Skyfire API Key
        </label>
      </div>
    </form>
  )
}

export default ApiInput
