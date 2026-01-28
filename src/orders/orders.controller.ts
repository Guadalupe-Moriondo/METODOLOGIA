import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from '../users/current-user.decorator';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
create(
  @Body() dto: CreateOrderDto,
  @CurrentUser() user: any,) {
  return this.ordersService.create(dto, user.userId);
}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdateOrderDto,
  @CurrentUser() user: any,
) {
  return this.ordersService.updateStatus(+id, dto, user);
}


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  
}
