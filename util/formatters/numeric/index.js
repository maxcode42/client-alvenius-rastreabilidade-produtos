export function formatSixDigits(value) {
  const result = String(value).padStart(4, "0");
  return result;
}
