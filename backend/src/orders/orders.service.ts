import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClientsService } from '../clients/clients.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  ChangeStatusDto,
  IntakeDto,
} from './dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clients: ClientsService,
  ) {}

  async create(dto: CreateOrderDto) {
    // Определяем клиента: по id, либо находим/создаём по номеру/waId.
    let clientId = dto.clientId;
    if (!clientId) {
      const client = await this.clients.findOrCreate({
        phone: dto.phone,
        waId: dto.waId,
        name: dto.clientName,
      });
      clientId = client.id;
    }

    const order = await this.prisma.order.create({
      data: {
        clientId,
        complaint: dto.complaint,
        source: dto.source,
        visitAt: dto.visitAt ? new Date(dto.visitAt) : undefined,
        events: {
          create: { toStatus: OrderStatus.NEW },
        },
      },
      include: this.include(),
    });
    return order;
  }

  /**
   * Приём заявки из WhatsApp (вручную, NotificationListener или coexistence).
   * Находит клиента по номеру/waId и заводит «Новую заявку» с текстом жалобы.
   */
  async intake(dto: IntakeDto) {
    const client = await this.clients.findOrCreate({
      phone: dto.phone,
      waId: dto.waId,
      name: dto.name,
    });

    return this.prisma.order.create({
      data: {
        clientId: client.id,
        complaint: dto.text,
        source: dto.source ?? 'whatsapp',
        events: { create: { toStatus: OrderStatus.NEW } },
      },
      include: this.include(),
    });
  }

  async findAll(status?: OrderStatus, search?: string) {
    return this.prisma.order.findMany({
      where: {
        status: status ?? undefined,
        ...(search
          ? {
              OR: [
                { complaint: { contains: search, mode: 'insensitive' } },
                { client: { name: { contains: search, mode: 'insensitive' } } },
                { client: { phone: { contains: search } } },
              ],
            }
          : {}),
      },
      include: this.include(),
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        ...this.include(),
        items: true,
        events: { orderBy: { at: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException('Заказ не найден');
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: {
        ...dto,
        visitAt: dto.visitAt ? new Date(dto.visitAt) : undefined,
        warrantyUntil: dto.warrantyUntil
          ? new Date(dto.warrantyUntil)
          : undefined,
      },
      include: this.include(),
    });
  }

  /** Смена статуса с записью в историю (order_events) — из неё считается статистика. */
  async changeStatus(id: string, dto: ChangeStatusDto) {
    const order = await this.findOne(id);

    const closing =
      dto.status === OrderStatus.CLOSED || dto.status === OrderStatus.REFUSED;

    return this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        refusalReason:
          dto.status === OrderStatus.REFUSED ? dto.refusalReason : undefined,
        closedAt: closing ? new Date() : undefined,
        events: {
          create: {
            fromStatus: order.status,
            toStatus: dto.status,
            comment: dto.comment,
          },
        },
      },
      include: this.include(),
    });
  }

  private include() {
    return {
      client: true,
      appliance: true,
    };
  }
}
