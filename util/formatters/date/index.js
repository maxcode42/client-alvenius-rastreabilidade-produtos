export function formatToPtBR(dateStr) {
  if (!dateStr) return;

  const year = Number(dateStr.slice(0, 4));
  const month = Number(dateStr.slice(4, 6)) - 1;
  const day = Number(dateStr.slice(6, 8));

  const date = new Date(year, month, day); // cria em horário local

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function formatDateCustom(date, time) {
  if (time?.trim().length === 0) {
    time = "00:00";
  }

  if (date?.trim().length > 0) {
    const dateFull = date.concat(" ").concat(time);
    const result = dateFull.replace(
      /(\d{4})(\d{2})(\d{2})\s(\d{2}:\d{2})/,
      "$3/$2/$1 às $4",
    );

    return result;
  }

  return "-- / -- / ---- às -- : --";
}
