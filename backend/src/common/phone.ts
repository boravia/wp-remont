/**
 * Нормализация казахстанского номера к единому виду +77XXXXXXXXX.
 * Принимает 8 777..., +7 777..., 7777..., с пробелами/скобками/дефисами.
 * Возвращает null, если номер не распознан (например, клиент без номера —
 * только по WhatsApp-юзернейму).
 */
export function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;

  // Оставляем только цифры.
  let digits = raw.replace(/\D/g, '');

  if (digits.length === 0) return null;

  // 8XXXXXXXXXX -> 7XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  }

  // 11 цифр, начинается с 7 — казахстанский/российский формат.
  if (digits.length === 11 && digits.startsWith('7')) {
    return '+' + digits;
  }

  // 10 цифр (без кода страны) — считаем казахстанским, добавляем 7.
  if (digits.length === 10) {
    return '+7' + digits;
  }

  // Прочее — возвращаем с плюсом как есть, не теряем номер.
  return '+' + digits;
}
