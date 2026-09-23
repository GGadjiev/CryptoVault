import axios from "axios";
import type { ApiError } from "../types";

export const client = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 10_000,
})

const toApiError = (error: unknown): ApiError => {
  if (!axios.isAxiosError(error)) {
    return { status: null, message: "Неизвестная ошибка." }
  }

  if (error.response === undefined) {
    if (navigator.onLine) {
      return {
        status: null,
        message: "Сервер недоступен или отклонил запрос. Возможно, лимит запросов - подожди минуту.",
      };
    }
    return { status: null, message: "Нет соединения. Проверь интернет." };
  }

  const status = error.response.status;

  if (status === 404) {
    return {
      status,
      message: "Данные не найдены",
    }
  }

  if (status === 429) {
    return {
      status,
      message: "Слишком много запросов. Подождите минуту и попробуйте снова"
    }
  }

  if (status === 500) {
    return {
      status,
      message: "Проблемы на сервере CoinGecko."
    }
  }

  return {
    status,
    message: `Ошибка запроса - код: ${status}.`,
  }
}

export const isApiError = (value: unknown): value is ApiError => {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "message" in value
  )
}

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
)