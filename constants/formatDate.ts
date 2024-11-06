const formatDate = (date?: number | Date | undefined) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short", // Nombre corto del mes (por ejemplo, agosto)
    day: "numeric", // Día numérico del mes (p. ej., 4)
    hour: "numeric", // Hora numérica (p. ej., 1)
    minute: "numeric", // Minuto numérico (p. ej., 30)
    hour12: true, // Formato de reloj de 12 horas (por ejemplo, am/pm)
    year: "numeric",
  }).format(date);

  return formattedDate;
};

export default formatDate;
