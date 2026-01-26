
export const logDP = (...args: unknown[]) => console.debug("[DP]", ...args);

export const toNumber = (val: unknown): number => {
  if (val === null || val === undefined || val === "") return 0;
  const number = Number(val);
  return isNaN(number) ? 0 : number;
};

export const toStringSafe = (val: unknown): string => {
  if (val === null || val === undefined) return "";
  return String(val);
};

export const normalizeNumberString = (val: string): string => {
  // e.g. "10,000" or full-width digits "１００００"
  return val
    .replace(/,/g, "")
    .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .trim();
};

export const toOptionalNumber = (val: unknown): number | null => {
  if (val === null || val === undefined || val === "") return null;
  const raw = typeof val === "string" ? normalizeNumberString(val) : val;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};
