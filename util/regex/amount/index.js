export function isValidAmount(value) {
  return /^(\d{0,3})([.,]?)(\d{0,3})/.test(value);
}
