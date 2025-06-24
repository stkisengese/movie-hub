import type { APIError } from "@/types"
import { ERROR_MESSAGES } from "./constants"

export class MovieFlixError extends Error {
    public readonly status?: number
    public readonly code?: string
    public readonly details?: unknown

    constructor(message: string, status?: number, code?: string, details?: unknown) {
        super(message)
        this.name = "MovieFlixError"
        this.status = status
        this.code = code
        this.details = details
    }
}

export class APIKeyError extends MovieFlixError {
    constructor(service: "TMDB" | "OMDB") {
        super(`${service} ${ERROR_MESSAGES.API_KEY_MISSING}`, 401, "API_KEY_MISSING")
        this.name = "APIKeyError"
    }
}

export class NetworkError extends MovieFlixError {
    constructor(message: string = ERROR_MESSAGES.NETWORK_ERROR, details?: unknown) {
        super(message, undefined, "NETWORK_ERROR", details)
        this.name = "NetworkError"
    }
}

export class TimeoutError extends MovieFlixError {
    constructor(message: string = ERROR_MESSAGES.TIMEOUT_ERROR) {
        super(message, 408, "TIMEOUT_ERROR")
        this.name = "TimeoutError"
    }
}

export class NotFoundError extends MovieFlixError {
    constructor(resource = "Content") {
        super(`${resource} ${ERROR_MESSAGES.NOT_FOUND.toLowerCase()}`, 404, "NOT_FOUND")
        this.name = "NotFoundError"
    }
}

export class RateLimitError extends MovieFlixError {
    constructor(message: string = ERROR_MESSAGES.RATE_LIMITED) {
        super(message, 429, "RATE_LIMITED")
        this.name = "RateLimitError"
    }
}

export function createAPIError(error: unknown): APIError {
    if (error instanceof MovieFlixError) {
        return {
            message: error.message,
            status: error.status,
            code: error.code,
            details: error.details,
        }
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            details: error,
        }
    }

    return {
        message: ERROR_MESSAGES.UNKNOWN_ERROR,
        details: error,
    }
}

export function handleFetchError(error: unknown): MovieFlixError {
    if (error instanceof TypeError && error.message.includes("fetch")) {
        return new NetworkError("Failed to connect to the server")
    }

    if (error instanceof Error && error.name === "AbortError") {
        return new TimeoutError()
    }

    if (error instanceof MovieFlixError) {
        return error
    }

    return new MovieFlixError(error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR)
}

export function getErrorMessage(error: APIError): string {
    switch (error.code) {
        case "API_KEY_MISSING":
            return ERROR_MESSAGES.API_KEY_MISSING
        case "NETWORK_ERROR":
            return ERROR_MESSAGES.NETWORK_ERROR
        case "TIMEOUT_ERROR":
            return ERROR_MESSAGES.TIMEOUT_ERROR
        case "NOT_FOUND":
            return ERROR_MESSAGES.NOT_FOUND
        case "RATE_LIMITED":
            return ERROR_MESSAGES.RATE_LIMITED
        default:
            return error.message || ERROR_MESSAGES.UNKNOWN_ERROR
    }
}
