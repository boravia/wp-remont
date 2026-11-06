// Адрес сервера. На эмуляторе Android localhost недоступен — используй IP ноутбука
// в локальной сети, например http://192.168.1.50:3000. На реальном телефоне через
// Expo Go — тоже IP ноутбука (телефон и ноут в одной Wi-Fi сети).
export const API_BASE = 'http://localhost:3000';

export type OrderStatus =
  | 'NEW'
  | 'SCHEDULED'
  | 'DIAGNOSIS'
  | 'WAITING_PART'
  | 'REPAIRING'
  | 'DONE'
  | 'CLOSED'
  | 'REFUSED';

export interface Client {
  id: string;
  phone: string | null;
  waId: string | null;
  name: string | null;
  address: string | null;
  district: string | null;
  source: string | null;
  notes: string | null;
  tags: string[];
}

export interface Appliance {
  id: string;
  type: string;
  brand: string | null;
  model: string | null;
}

export interface Order {
  id: string;
  number: number;
  status: OrderStatus;
  complaint: string | null;
  diagnosis: string | null;
  visitAt: string | null;
  total: number;
  paid: number;
  source: string | null;
  createdAt: string;
  client: Client;
  appliance: Appliance | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listOrders: (status?: OrderStatus, search?: string) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    const q = params.toString();
    return request<Order[]>(`/orders${q ? `?${q}` : ''}`);
  },
  getOrder: (id: string) => request<Order>(`/orders/${id}`),
  intake: (data: { phone?: string; name?: string; text: string }) =>
    request<Order>('/orders/intake', {
      method: 'POST',
      body: JSON.stringify({ ...data, source: 'manual' }),
    }),
  changeStatus: (id: string, status: OrderStatus, comment?: string) =>
    request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    }),
};
