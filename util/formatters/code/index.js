import { normalizeAlphanumeric } from "util/formatters/text";

export function formatCodeDefault(code) {
  const text = normalizeAlphanumeric(code);
  const match = text.match(/^(?=.{6,15}$)([A-Z]{2})([A-Za-z0-9]+)$/);
  if (!match) return null;

  const prefix = match[1];
  let rest = match[2];

  const groups = [prefix];

  if (rest.length >= 4) {
    groups.push(rest.slice(0, 4));
    rest = rest.slice(4);
  }

  if (rest.length >= 5) {
    groups.push(rest.slice(0, 5));
    rest = rest.slice(5);
  }

  if (rest.length >= 4) {
    const size = rest.length >= 5 ? 5 : 4;
    groups.push(rest.slice(0, size));
    rest = rest.slice(size);
  }

  if (rest.length > 0) {
    groups.push(rest);
  }

  return groups.join("-");
}
