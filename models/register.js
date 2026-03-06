import apiProtheus from "infra/provider/api-protheus";

async function runInsertAPIProtheus(registerInputValues) {
  const results =
    await apiProtheus.execute.register.create(registerInputValues);

  return results;
}

function normalizeAlphanumeric(text) {
  return text.replace(/[^A-Za-z0-9]/g, "").trim();
}

function normalizeNumericFloat(text) {
  return Number(String(text).replace(",", "."));
}

function normalizedText(text) {
  return new TextDecoder("utf-8")
    .decode(new TextEncoder().encode(text))
    .normalize("NFC");
}

async function create(registerInputValues, tokenProtheus) {
  const componentes = registerInputValues?.itens?.map((item) => ({
    COD_PRODUTO: String(normalizeAlphanumeric(item?.codigo)),
    DESC: String(normalizedText(item?.descricao)),
    COD_FORNEC: String(normalizedText(item?.fornecedor)),
    CORRIDA: String(normalizedText(item?.fluxo)),
    QUANT: normalizeNumericFloat(item?.quantidade),
  }));

  const registerObject = {
    QrCode: {
      SPOOL: String(normalizeAlphanumeric(registerInputValues?.spool?.codigo)),
      DESC: String(normalizedText(registerInputValues?.spool?.descricao)),
      Componentes: componentes,
    },
  };

  const result = await runInsertAPIProtheus({
    data: registerObject,
    tokenProtheus,
  });

  return result;
}

const register = {
  create,
};

export default register;
