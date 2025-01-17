/**
 * Test if session storage is supported for the browser.
 * @returns {boolean}
 */

import { Message } from "ai"
import { AxiosResponse } from "axios"

const API_KEY_LOCAL_STORAGE_KEY = "do_not_use_local_storage_key"
export const isLocalStorageSupported = () => {
  try {
    const key = "__storage__test"
    if (window) {
      window["localStorage"].setItem(key, "")
      window["localStorage"].removeItem(key)
      return true
    } else {
      return false
    }
  } catch {
    return false
  }
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export const getApiKeyFromLocalStorage = () => {
  if (!isLocalStorageSupported()) {
    return null
  }
  return localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY)
}

export const removeApiKeyFromLocalStorage = () => {
  if (!isLocalStorageSupported()) {
    return
  }
  localStorage.removeItem(API_KEY_LOCAL_STORAGE_KEY)
}

export const setApiKeyToLocalStorage = (apiKey: string): boolean => {
  if (!isLocalStorageSupported()) {
    return false
  }
  if (apiKey === undefined || !isValidUUID(apiKey)) {
    removeApiKeyFromLocalStorage()
    return false
  }

  localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, apiKey)
  return true
}

export function usdAmount(usdc: number | string) {
  if (usdc === undefined || usdc === null) {
    return "0.00 USD"
  }
  if (typeof usdc === "string") {
    usdc = usdc.split(" ")[0]
  }
  const usdAmount = Number(usdc)
  return "$" + usdAmount.toFixed(7) + " USD"
}

export function truncateEthAddress(address: string) {
  if (!address || address.length < 10) {
    return address
  }
  const start = address.slice(0, 4)
  const end = address.slice(-4)
  return `${start}...${end}`
}
