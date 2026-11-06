import { Linking } from 'react-native';

/**
 * Открывает чат WhatsApp с номером без сохранения контакта.
 * Работает без API и без оплаты: wa.me — официальная короткая ссылка.
 */
export function openWhatsApp(phone: string | null, text?: string) {
  if (!phone) return;
  const digits = phone.replace(/\D/g, ''); // wa.me хочет номер без плюса
  const url = `https://wa.me/${digits}${
    text ? `?text=${encodeURIComponent(text)}` : ''
  }`;
  Linking.openURL(url);
}

export function callPhone(phone: string | null) {
  if (!phone) return;
  Linking.openURL(`tel:${phone}`);
}
