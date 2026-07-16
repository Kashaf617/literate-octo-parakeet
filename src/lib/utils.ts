export function fmtCurrency(value: number, currency = "PKR") {
  const symbols: Record<string, string> = { USD: "$", SAR: "SAR ", PKR: "PKR " };
  const symbol = symbols[currency] ?? `${currency} `;
  return `${symbol}${value.toFixed(2)}`;
}

export function slugify(input: string) {
  return input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function genOrderNumber() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `DO-${dateStr}-${rnd}`;
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
