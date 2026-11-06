import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [ClientsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
