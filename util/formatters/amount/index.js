export const handleChangeAmount = (e) => {
  let input = e.target.value;

  // converte ponto para vírgula
  input = input.replace(/\./g, ",");

  // remove caracteres inválidos
  input = input.replace(/[^\d,]/g, "");

  // impede mais de uma vírgula
  const parts = input.split(",");
  if (parts.length > 2) return;

  // limita inteiros a 3 dígitos
  if (parts[0].length > 3) return;

  // limita decimais a 3 dígitos
  if (parts[1] && parts[1].length > 3) return;

  return input;
};
