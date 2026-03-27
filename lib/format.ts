export function formatCost(amount: number | null): string {
  if (amount === null || amount === undefined) return 'N/A';
  return '$' + Math.round(amount).toLocaleString('en-US');
}

export function formatCostCompact(amount: number | null): string {
  if (amount === null || amount === undefined) return 'N/A';
  if (amount >= 1000) {
    return '$' + (amount / 1000).toFixed(1) + 'K';
  }
  return '$' + Math.round(amount).toLocaleString('en-US');
}

export function formatHourly(amount: number | null): string {
  if (amount === null || amount === undefined) return 'N/A';
  return '$' + amount.toFixed(2);
}

export function formatNumber(num: number | null): string {
  if (num === null || num === undefined) return 'N/A';
  return num.toLocaleString('en-US');
}

export function formatPercent(pct: number | null): string {
  if (pct === null || pct === undefined) return 'N/A';
  return pct.toFixed(1) + '%';
}

export function getDataYear(): number {
  return 2024; // Genworth Cost of Care Survey latest release
}
