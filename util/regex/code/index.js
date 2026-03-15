import { normalizedText } from "util/formatters/text";

export function regexCodeSpool(text) {
  const regex = /^\s*(SP(?:-[A-Za-z0-9]+)+)\s+(.+)$/;

  const normalized = normalizedText(text);

  return normalized.match(regex);
}
