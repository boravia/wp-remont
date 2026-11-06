import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { api, Order, OrderStatus } from '../../src/api/client';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  NEXT_STATUSES,
} from '../../src/status';
import { openWhatsApp, callPhone } from '../../src/whatsapp';

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.getOrder(id);
      setOrder(data);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить заказ');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const changeStatus = async (status: OrderStatus) => {
    try {
      const updated = await api.changeStatus(id, status);
      setOrder(updated);
    } catch {
      Alert.alert('Ошибка', 'Не удалось изменить статус');
    }
  };

  if (loading || !order) {
    return <ActivityIndicator style={{ marginTop: 60 }} size="large" />;
  }

  const c = order.client;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <Text style={styles.number}>Заказ №{order.number}</Text>
        <View
          style={[styles.badge, { backgroundColor: STATUS_COLORS[order.status] }]}
        >
          <Text style={styles.badgeText}>{STATUS_LABELS[order.status]}</Text>
        </View>
      </View>

      {/* Клиент */}
      <View style={styles.block}>
        <Text style={styles.name}>{c.name || 'Без имени'}</Text>
        {c.phone ? <Text style={styles.line}>{c.phone}</Text> : null}
        {c.address ? <Text style={styles.line}>{c.address}</Text> : null}
        {c.source ? <Text style={styles.muted}>Источник: {c.source}</Text> : null}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.action, { backgroundColor: '#16a34a' }]}
            onPress={() => openWhatsApp(c.phone)}
          >
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.action, { backgroundColor: '#2563eb' }]}
            onPress={() => callPhone(c.phone)}
          >
            <Text style={styles.actionText}>Позвонить</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Техника и жалоба */}
      <View style={styles.block}>
        {order.appliance ? (
          <Text style={styles.line}>
            {order.appliance.type}
            {order.appliance.brand ? ` · ${order.appliance.brand}` : ''}
            {order.appliance.model ? ` ${order.appliance.model}` : ''}
          </Text>
        ) : null}
        <Text style={styles.label}>Жалоба</Text>
        <Text style={styles.body}>{order.complaint || '—'}</Text>
        {order.diagnosis ? (
          <>
            <Text style={styles.label}>Диагноз</Text>
            <Text style={styles.body}>{order.diagnosis}</Text>
          </>
        ) : null}
      </View>

      {/* Деньги */}
      <View style={styles.block}>
        <View style={styles.moneyRow}>
          <Text style={styles.muted}>Итог</Text>
          <Text style={styles.money}>{order.total.toLocaleString('ru-RU')} ₸</Text>
        </View>
        <View style={styles.moneyRow}>
          <Text style={styles.muted}>Оплачено</Text>
          <Text style={styles.money}>{order.paid.toLocaleString('ru-RU')} ₸</Text>
        </View>
      </View>

      {/* Смена статуса */}
      {NEXT_STATUSES[order.status].length > 0 ? (
        <View style={styles.block}>
          <Text style={styles.label}>Перевести в</Text>
          <View style={styles.statusButtons}>
            {NEXT_STATUSES[order.status].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.statusBtn, { borderColor: STATUS_COLORS[s] }]}
                onPress={() => changeStatus(s)}
              >
                <Text style={[styles.statusBtnText, { color: STATUS_COLORS[s] }]}>
                  {STATUS_LABELS[s]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  number: { fontSize: 20, fontWeight: '700', color: '#111827' },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  block: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  line: { fontSize: 15, color: '#374151', marginBottom: 2 },
  muted: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  label: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 2,
  },
  body: { fontSize: 15, color: '#111827', lineHeight: 21 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  action: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  moneyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  money: { fontSize: 15, fontWeight: '600', color: '#111827' },
  statusButtons: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 6 },
  statusBtn: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  statusBtnText: { fontWeight: '600', fontSize: 14 },
});
