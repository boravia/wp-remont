import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PrismaModule, ClientsModule, OrdersModule],
})
export class AppModule {}
