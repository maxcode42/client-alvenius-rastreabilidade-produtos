import { normalizeAlphanumeric } from "util/formatters/text";

// function formatCodeDefault(code) {
//   const result = code.replace(
//     /^([A-Z]{2})(\d{4})(\d{5})(\d{3})$/,
//     "$1-$2-$3-$4",
//   );
//   return result;
// }
export function formatCodeDefault(code) {
  // const result = code.replace(
  //   /^([A-Z]{2})(\d{4})(\d{5})(\d{4})$/,
  //   "$1-$2-$3-$4",
  // );
  // const result = code.replace(
  //   /^(?=.{15}$)([A-Z]{2})([A-Za-z0-9]{4})([A-Za-z0-9]{5})([A-Za-z0-9]{4,5})$/,
  //   (_, g1, g2, g3, g4) => `${g1}-${g2}-${g3}-${g4}`,
  // );
  // return result;

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
