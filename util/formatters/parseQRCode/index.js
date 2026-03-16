const { normalizeAlphanumeric } = require("util/formatters/text");
const { regexCodeSpool } = require("util/regex/code");

export function formatObjectSpool(text) {
  const match = regexCodeSpool(text);

  if (!match) {
    return null;
  }

  const dataObject = {
    codigo: normalizeAlphanumeric(match[1]),
    descricao: match[2],
  };

  return dataObject;
}
