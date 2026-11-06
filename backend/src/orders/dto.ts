import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  // Либо существующий клиент по id...
  @IsOptional()
  @IsString()
  clientId?: string;

  // ...либо данные для поиска/создания клиента (ядро приёма заявок).
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  waId?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  complaint?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsDateString()
  visitAt?: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  complaint?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsDateString()
  visitAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  total?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  prepaid?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  paid?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsDateString()
  warrantyUntil?: string;
}

export class ChangeStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  comment?: string;

  // Для статуса REFUSED — причина отказа (дорого, не ремонтопригодно, передумал).
  @IsOptional()
  @IsString()
  refusalReason?: string;
}

/** Заявка прямо из WhatsApp: номер + текст сообщения. */
export class IntakeDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  waId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  source?: string; // whatsapp-notification, whatsapp-api, manual
}
