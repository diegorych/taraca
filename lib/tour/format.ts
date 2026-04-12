/**
 * Formateo de fechas y ubicación para la sección Gira (UI).
 * `localDate` en dominio: ISO `YYYY-MM-DD`.
 */
export function formatTourDateDDMMYYYY(isoDate: string): string {
  const day = isoDate.slice(8, 10);
  const month = isoDate.slice(5, 7);
  const year = isoDate.slice(0, 4);
  if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(day)) {
    return isoDate;
  }
  return `${day}.${month}.${year}`;
}

const MONTHS_EN = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

/** Ej. 2026-05-05 → "MAY 05 2026" */
export function formatTourDateMonDDYYYY(isoDate: string): string {
  const y = isoDate.slice(0, 4);
  const m = isoDate.slice(5, 7);
  const d = isoDate.slice(8, 10);
  if (!/^\d{4}$/.test(y) || !/^\d{2}$/.test(m) || !/^\d{2}$/.test(d)) {
    return isoDate;
  }
  const mi = parseInt(m, 10) - 1;
  if (mi < 0 || mi > 11) return isoDate;
  return `${MONTHS_EN[mi]} ${d} ${y}`;
}

/** Ej. Maipú + AR → "MAIPÚ, ARG." (respeta mayúsculas locales) */
export function formatTourCityCountryLine(city: string, countryCode: string): string {
  const c = city.trim();
  const cc = countryCode.trim().toUpperCase();
  return `${c}, ${cc}.`.toLocaleUpperCase("es");
}
