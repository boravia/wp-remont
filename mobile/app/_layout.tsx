import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Заказы' }} />
        <Stack.Screen name="order/[id]" options={{ title: 'Заказ' }} />
        <Stack.Screen
          name="new"
          options={{ title: 'Новая заявка', presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}
