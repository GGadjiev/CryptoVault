export type Currency = 'USD' | 'RUB' | 'EUR'

const moneyFormatters: Record<Currency, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }),
  RUB: new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" }),
  EUR: new Intl.NumberFormat("ru-RU", { style: "currency", currency: "EUR" }),
};

const compactFormatters: Record<Currency, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat("ru-RU", {
    style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 2,
  }),
  RUB: new Intl.NumberFormat("ru-RU", {
    style: "currency", currency: "RUB", notation: "compact", maximumFractionDigits: 2,
  }),
  EUR: new Intl.NumberFormat("ru-RU", {
    style: "currency", currency: "EUR", notation: "compact", maximumFractionDigits: 2,
  }),
};

const percent = new Intl.NumberFormat("ru-RU", {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const FLAT_THRESHOLD = 0.05;

export const formatMoney = (value: number, currency: Currency): string => {
  if (value >= 1) return moneyFormatters[currency].format(value);
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumSignificantDigits: 3,
  }).format(value)
}

export const formatCompactMoney = (value: number, currency: Currency): string => {
  return compactFormatters[currency].format(value);
}

export function formatPercent(value: number | null): string {
  if (value === null) return "—";
  const arrow =
    value > FLAT_THRESHOLD ? "▲ " :
      value < -FLAT_THRESHOLD ? "▼ " : "";
  const shown = arrow ? Math.abs(value) : value;
  return arrow + percent.format(shown / 100);
}

export const getTrend = (value: number | null): 'success' | 'danger' | 'muted' => {
  if (value === null) return 'muted'
  if (Math.abs(value) < FLAT_THRESHOLD) return 'muted'
  return value >= 0 ? 'success' : 'danger'
}

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const dateShortFmt = new Intl.DateTimeFormat("ru-RU", {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export const formatDate = (isoDate: string): string => {
  return dateFmt.format(new Date(isoDate))
}

export const formatDateShort = (isoDate: string): string => {
  return dateShortFmt.format(new Date(isoDate))
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млрд`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} тыс`;
  }
  return value.toLocaleString("ru-RU");
}

export const formatAmount = (value: number): string => {
  return value.toLocaleString('ru-RU', { maximumFractionDigits: 4 })
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  RUB: "₽",
  EUR: "€",
};

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency];
}