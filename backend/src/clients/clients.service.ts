import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { normalizePhone } from '../common/phone';
import { CreateClientDto, UpdateClientDto, CreateApplianceDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Находит клиента по номеру или waId, иначе создаёт нового.
   * Это ядро «заявка -> карточка клиента»: один номер = один клиент.
   */
  async findOrCreate(params: {
    phone?: string | null;
    waId?: string | null;
    name?: string | null;
  }) {
    const phone = normalizePhone(params.phone);
    const waId = params.waId ?? null;

    let client = phone
      ? await this.prisma.client.findUnique({ where: { phone } })
      : null;
    if (!client && waId) {
      client = await this.prisma.client.findUnique({ where: { waId } });
    }

    if (client) return client;

    return this.prisma.client.create({
      data: {
        phone: phone ?? undefined,
        waId: waId ?? undefined,
        name: params.name ?? undefined,
      },
    });
  }

  async create(dto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        ...dto,
        phone: normalizePhone(dto.phone) ?? undefined,
        tags: dto.tags ?? [],
      },
    });
  }

  async findAll(search?: string) {
    if (!search) {
      return this.prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
    }
    const normalized = normalizePhone(search);
    return this.prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { phone: { contains: normalized ?? search } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        appliances: true,
        orders: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!client) throw new NotFoundException('Клиент не найден');
    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id);
    return this.prisma.client.update({
      where: { id },
      data: {
        ...dto,
        phone:
          dto.phone !== undefined
            ? normalizePhone(dto.phone) ?? undefined
            : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Каскадно удаляет технику и заказы клиента (см. onDelete в схеме) —
    // это требование закона об удалении данных по запросу.
    await this.prisma.client.delete({ where: { id } });
    return { ok: true };
  }

  async addAppliance(clientId: string, dto: CreateApplianceDto) {
    await this.findOne(clientId);
    return this.prisma.appliance.create({
      data: { ...dto, clientId },
    });
  }
}
