"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Use a ref to store the initial value to prevent it from changing on every render
  const initialValueRef = useRef(initialValue)

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Only run this on the client side
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        return JSON.parse(item)
      }
      return initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsInitialized(true)
      return
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsedValue = JSON.parse(item)
        setStoredValue(parsedValue)
      } else {
        // If no item exists, set the initial value
        setStoredValue(initialValueRef.current)
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      setStoredValue(initialValueRef.current)
    } finally {
      setIsInitialized(true)
    }
  }, [key]) // Only depend on key, not initialValue

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValueRef.current)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key])

  return [isInitialized ? storedValue : initialValueRef.current, setValue, removeValue]
}
