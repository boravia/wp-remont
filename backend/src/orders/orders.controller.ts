import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  ChangeStatusDto,
  IntakeDto,
} from './dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
  ) {
    return this.orders.findAll(status, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orders.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  /** Приём заявки из WhatsApp: номер/waId + текст -> новая заявка. */
  @Post('intake')
  intake(@Body() dto: IntakeDto) {
    return this.orders.intake(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orders.update(id, dto);
  }

  @Patch(':id/status')
  changeStatus(@Param('id') id: string, @Body() dto: ChangeStatusDto) {
    return this.orders.changeStatus(id, dto);
  }
}
