import { normalizedText } from "util/formatters/text";

export function regexCodeSpool(text) {
  // const match = normalized
  //   .trim()
  //   .match(/^(SP-[A-Za-z0-9]{4}-[A-Za-z0-9]{5}-[A-Za-z0-9]{3})\s+(.*)$/);
  const regex = /^(SP(?:-[A-Za-z0-9]+)+)\s+([\s\S]*)$/;

  const normalized = normalizedText(text);

  return normalized.match(regex);
}
