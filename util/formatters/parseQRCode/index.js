const { normalizeAlphanumeric } = require("util/formatters/text");
const { regexCodeSpool, regexCodeComponent } = require("util/regex/code");

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

export function formatObjectComponent(text) {
  const match = regexCodeComponent(text);

  if (!match) {
    return null;
  }

  const dataObject = {};

  for (const m of match) {
    dataObject[m[1]] = m[2].replace(/\|/g, "").trimStart().trimEnd();
  }

  return dataObject;
}
