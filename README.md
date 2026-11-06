# Remont — приложение для ремонта бытовой техники

Стартовый каркас: заказы из WhatsApp, база клиентов, статистика.

Монорепо:

- `backend/` — сервер NestJS + PostgreSQL (Prisma), Docker Compose. Модули clients и orders.
- `mobile/` — мобильное приложение Expo (React Native). Список заказов, карточка, кнопка WhatsApp.

## Быстрый старт

### 1. Бэкенд

```bash
cd backend
cp .env.example .env
docker compose up -d        # поднимает PostgreSQL
npm install
npx prisma migrate dev --name init   # создаёт таблицы
npm run seed                # (опционально) пара тестовых заказов
npm run start:dev           # сервер на http://localhost:3000
```

Проверка: открой http://localhost:3000/orders — должен вернуть JSON (пустой массив или тестовые заказы).

### 2. Приложение

```bash
cd mobile
npm install
# впиши адрес сервера в mobile/src/api/client.ts (по умолчанию localhost)
npx expo start
```

Отсканируй QR-код приложением **Expo Go** на телефоне. Телефон и ноутбук должны быть в одной сети;
если приложение не достаёт до сервера — замени `localhost` на IP ноутбука в локальной сети
(напр. `http://192.168.1.50:3000`).

## Что дальше

Следующие шаги расписаны в плане проекта. Коротко: статусы заказов → фото → NotificationListener →
WhatsApp coexistence → статистика → голосовой помощник «Сара».

Этот каркас — только этап 1 (основа): база, API заказов и клиентов, список и карточка.
