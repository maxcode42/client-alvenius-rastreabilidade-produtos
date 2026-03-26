import { normalizeDelimiter, normalizeText } from "util/formatters/text";

export function regexCodeSpool(text) {
  const regex = /^\s*(SP(?:-[A-Za-z0-9]+)+)\s+(.+)$/;

  const normalized = normalizeText(text);

  return normalized.match(regex);
}

export function regexCodeComponent(text) {
  const regex = /([A-Z_]+):\s*(.*?)(?=\s+[A-Z_]+:|$)/g;

  const textNormalized = normalizeDelimiter(text);

  return textNormalized.matchAll(regex);
}
