import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Пара тестовых клиентов с заказами, чтобы в приложении сразу было что смотреть.
  const aizhan = await prisma.client.create({
    data: {
      phone: '+77011234567',
      name: 'Айжан',
      address: 'мкр Самал, д. 12, кв. 5',
      district: 'Самал',
      source: '2ГИС',
      appliances: {
        create: { type: 'Стиральная машина', brand: 'LG', model: 'F2J3' },
      },
    },
    include: { appliances: true },
  });

  await prisma.order.create({
    data: {
      clientId: aizhan.id,
      applianceId: aizhan.appliances[0].id,
      complaint: 'Не сливает воду, гудит',
      status: OrderStatus.DIAGNOSIS,
      source: '2ГИС',
      events: {
        create: [
          { toStatus: OrderStatus.NEW },
          { fromStatus: OrderStatus.NEW, toStatus: OrderStatus.SCHEDULED },
          { fromStatus: OrderStatus.SCHEDULED, toStatus: OrderStatus.DIAGNOSIS },
        ],
      },
    },
  });

  const bolat = await prisma.client.create({
    data: {
      phone: '+77029876543',
      name: 'Болат',
      district: 'Орбита',
      source: 'Instagram',
    },
  });

  await prisma.order.create({
    data: {
      clientId: bolat.id,
      complaint: 'Холодильник не морозит',
      status: OrderStatus.NEW,
      source: 'Instagram',
      events: { create: { toStatus: OrderStatus.NEW } },
    },
  });

  // eslint-disable-next-line no-console
  console.log('Тестовые данные добавлены.');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
