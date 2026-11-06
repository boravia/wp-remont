import {
  IsOptional,
  IsString,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

export class CreateClientDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  waId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateClientDto extends CreateClientDto {}

export class CreateApplianceDto {
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  serial?: string;

  @IsOptional()
  @IsInt()
  @Min(1950)
  year?: number;
}
