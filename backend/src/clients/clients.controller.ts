import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto, CreateApplianceDto } from './dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.clients.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clients.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateClientDto) {
    return this.clients.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clients.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clients.remove(id);
  }

  @Post(':id/appliances')
  addAppliance(@Param('id') id: string, @Body() dto: CreateApplianceDto) {
    return this.clients.addAppliance(id, dto);
  }
}
