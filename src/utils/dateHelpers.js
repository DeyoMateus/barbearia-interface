// Isola funções puras que manipulam datas e horários. Elas não dependem de nada do React e podem ser testadas unitariamente de forma simples.

export const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const MONTH_NAMES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function toDateKey(d) {
  return d.toISOString().slice(0, 10);
}

export function minToTime(m) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export function getAvailableSlots(barber, dateKey, neededMin, bookings) {
  const { workStart, workEnd, slotInterval, daysOff } = barber;
  const day_of_week = new Date(dateKey + "T12:00:00").getDay();
  if (daysOff.includes(day_of_week)) return [];

  const busy = bookings
    .filter((b) => b.barberId === barber.id && b.dateKey === dateKey)
    .map((b) => ({ start: b.startMin, end: b.startMin + b.durationMin }));

  const slots = [];
  for (let t = workStart; t + neededMin <= workEnd; t += slotInterval) {
    const end = t + neededMin;
    if (!busy.some((b) => t < b.end && end > b.start)) slots.push(t);
  }
  return slots;
}
