import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { api, Order, OrderStatus } from '../src/api/client';
import { STATUS_LABELS, STATUS_COLORS, TABS } from '../src/status';

export default function OrdersScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<OrderStatus | 'ALL'>('NEW');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const status = tab === 'ALL' ? undefined : tab;
      const data = await api.listOrders(status, search || undefined);
      setOrders(data);
    } catch (e) {
      setError(
        'Не удалось загрузить заказы. Проверь, что сервер запущен и адрес в src/api/client.ts верный.',
      );
    } finally {
      setLoading(false);
    }
  }, [tab, search]);

  // Перезагружаем список при каждом возврате на экран.
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Поиск по номеру, имени, адресу"
        placeholderTextColor="#9ca3af"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={load}
        returnKeyType="search"
      />

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={load} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Заказов пока нет</Text>
          }
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <Link href={`/order/${item.id}`} asChild>
              <TouchableOpacity style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardName}>
                    {item.client.name || item.client.phone || 'Без имени'}
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: STATUS_COLORS[item.status] },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {STATUS_LABELS[item.status]}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardComplaint} numberOfLines={2}>
                  {item.complaint || '—'}
                </Text>
                <Text style={styles.cardMeta}>
                  №{item.number}
                  {item.appliance ? ` · ${item.appliance.type}` : ''}
                  {item.client.phone ? ` · ${item.client.phone}` : ''}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/new')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  search: {
    margin: 12,
    marginBottom: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  tabs: { flexDirection: 'row', padding: 12, gap: 8, flexWrap: 'wrap' },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  tabActive: { backgroundColor: '#111827' },
  tabText: { color: '#374151', fontSize: 13, fontWeight: '500' },
  tabTextActive: { color: '#fff' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardName: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  cardComplaint: { color: '#4b5563', fontSize: 14, marginBottom: 6 },
  cardMeta: { color: '#9ca3af', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 60, color: '#9ca3af' },
  error: { padding: 24, color: '#dc2626', textAlign: 'center', lineHeight: 20 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: { color: '#fff', fontSize: 30, lineHeight: 34 },
});
