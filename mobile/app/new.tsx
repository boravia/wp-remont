import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../src/api/client';

export default function NewOrderScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!text.trim()) {
      Alert.alert('Заполни жалобу', 'Опиши, что сломалось');
      return;
    }
    setSaving(true);
    try {
      const order = await api.intake({
        phone: phone.trim() || undefined,
        name: name.trim() || undefined,
        text: text.trim(),
      });
      router.replace(`/order/${order.id}`);
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить заявку');
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Номер телефона</Text>
      <TextInput
        style={styles.input}
        placeholder="+7 701 123 45 67"
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Имя</Text>
      <TextInput
        style={styles.input}
        placeholder="Необязательно"
        placeholderTextColor="#9ca3af"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Что сломалось</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Напр.: стиралка LG не сливает воду"
        placeholderTextColor="#9ca3af"
        multiline
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity
        style={[styles.button, saving && { opacity: 0.6 }]}
        onPress={save}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? 'Сохраняю…' : 'Создать заявку'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  label: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
