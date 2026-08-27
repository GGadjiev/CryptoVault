const usd = new Intl.NumberFormat("en-US", {
  style: 'currency',
  currency: 'USD',
})

const compactUsd = new Intl.NumberFormat("en-US", {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
})

const percent = new Intl.NumberFormat("en-US", {
  style: 'percent',
  maximumFractionDigits: 2,
})

export const formatMoney = (value: number): string => {
  if (value >= 1) return usd.format(value)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3,
  }).format(value)
}

export const formatCompactMoney = (value: number): string => {
  return compactUsd.format(value)
}

export const formatPercent = (value: number | null): string => {
  if (value === null) return '-'
  const sign = value > 0 ? '+' : ''
  return sign + percent.format(value / 100)
}

export const getTrend = (value: number | null): 'success' | 'danger' | 'muted' => {
  if (value === null) return 'muted'
  return value >= 0 ? 'success' : 'danger'
}