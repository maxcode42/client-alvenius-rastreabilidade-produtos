export function normalizeText(text) {
  const result = new TextDecoder("utf-8")
    .decode(new TextEncoder().encode(text))
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trimStart()
    .trimEnd();

  return result;
}

export function normalizeAlphanumeric(text) {
  return normalizeText(text)
    ?.replace(/[^A-Za-z0-9]/g, "")
    .trim();
}

export function normalizeDelimiter(text) {
  // const obj = textNormalized
  //   .split("|")
  //   .map((p) => p.trim())
  //   .reduce((acc, item) => {
  //     const [k, ...v] = item.split(":");
  //     if (k && v.length) acc[k.trim().toUpperCase()] = v.join(":").trim();
  //     return acc;
  //   }, {});
  return normalizeText(text)?.replace(/(?<=\s)[I|](?=\s)/g, "|");
}
