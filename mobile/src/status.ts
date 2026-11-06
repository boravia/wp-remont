import { OrderStatus } from './api/client';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'Новая',
  SCHEDULED: 'Согласовано',
  DIAGNOSIS: 'Диагностика',
  WAITING_PART: 'Ждёт запчасть',
  REPAIRING: 'В ремонте',
  DONE: 'Готово',
  CLOSED: 'Закрыт',
  REFUSED: 'Отказ',
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  NEW: '#2563eb',
  SCHEDULED: '#7c3aed',
  DIAGNOSIS: '#0891b2',
  WAITING_PART: '#d97706',
  REPAIRING: '#ca8a04',
  DONE: '#16a34a',
  CLOSED: '#64748b',
  REFUSED: '#dc2626',
};

// Вкладки главного экрана.
export const TABS: { key: OrderStatus | 'ALL'; label: string }[] = [
  { key: 'NEW', label: 'Новые' },
  { key: 'WAITING_PART', label: 'Ждут запчасть' },
  { key: 'DONE', label: 'Готово' },
  { key: 'ALL', label: 'Все' },
];

// Порядок статусов для кнопок перевода.
export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['SCHEDULED', 'REFUSED'],
  SCHEDULED: ['DIAGNOSIS', 'REFUSED'],
  DIAGNOSIS: ['WAITING_PART', 'REPAIRING', 'REFUSED'],
  WAITING_PART: ['REPAIRING', 'REFUSED'],
  REPAIRING: ['DONE'],
  DONE: ['CLOSED'],
  CLOSED: [],
  REFUSED: [],
};
