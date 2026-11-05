import responseProtheus from "adapters/api-protheus/response";
import apiProtheus from "infra/provider/api-protheus";

async function runInsertAPIProtheus(registerInputValues) {
  const results =
    await apiProtheus.execute.transfer.component.create(registerInputValues);

  return results;
}

async function findAll(tokenProtheus) {
  const response = await apiProtheus.execute.transfer.component.read({
    tokenProtheus,
  });

  const results = await responseProtheus.execute.parseTransfer(response);

  return results;
}

async function create(tokenProtheus, transferInputValues, params) {
  function validSupplierDestination(supplier) {
    //CODIGO ALVENIUS: SOLICITADO DEIXAR FIXO - ROGERIO LINO
    const CODE_ALVENIUS = "000052";

    return !supplier ||
      supplier === undefined ||
      supplier === "undefined" ||
      supplier.trim().length === 0
      ? CODE_ALVENIUS
      : supplier;
  }

  function validProcesso(process) {
    return !process || process === null || String(process).trim().length === 0
      ? "CA"
      : process;
  }

  const dataObject = {
    componentes: transferInputValues.itens,
    fornecedor: {
      origem: validSupplierDestination(
        String(transferInputValues?.supplier_origin),
      ),
      destino: String(transferInputValues?.supplier_destination),
    },
    processo: validProcesso(transferInputValues?.process),
    aet: String(transferInputValues?.third),
  };

  const response = await runInsertAPIProtheus({
    data: dataObject,
    tokenProtheus,
    params,
  });

  return response;
}

const component = {
  findAll,
  create,
};

export default component;
