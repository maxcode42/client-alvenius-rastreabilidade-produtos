export function normalizedText(text) {
  return new TextDecoder("utf-8")
    .decode(new TextEncoder().encode(text))
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeAlphanumeric(text) {
  return normalizedText(text)
    ?.replace(/[^A-Za-z0-9]/g, "")
    .trim();
}
