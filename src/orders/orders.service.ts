import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // 🧑 USER → crear pedido
  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create({
      total: createOrderDto.total,
      status: OrderStatus.PENDING,
      user: { id: createOrderDto.userId },
      restaurant: { id: createOrderDto.restaurantId },
    });

    return this.orderRepository.save(order);
  }

  // 📋 ADMIN / USER → ver pedidos
  async findAll() {
    return this.orderRepository.find({
      relations: ['user', 'restaurant', 'driver'],
    });
  }

  // 🔍 ver pedido por ID
  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant', 'driver'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
  const order = await this.orderRepository.findOne({ where: { id } });
  if (!order) throw new NotFoundException('Order not found');

  if (dto.total !== undefined) order.total = dto.total;

  return this.orderRepository.save(order);
}

async remove(id: number) {
  const order = await this.orderRepository.findOne({ where: { id } });
  if (!order) throw new NotFoundException('Order not found');

  await this.orderRepository.remove(order);
  return { message: `Order ${id} deleted successfully` };
}


  // 🔄 VENDOR / DRIVER → cambiar estado
  async updateStatus(
  id: number,
  dto: UpdateOrderDto,
  role: string,
) {
  const order = await this.orderRepository.findOne({
    where: { id },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  if (role === 'VENDOR') {
    const allowed = [
      OrderStatus.ACCEPTED,
      OrderStatus.PREPARING,
      OrderStatus.READY,
    ];

    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        'Vendor cannot set this order status',
      );
    }
  }

  if (role === 'DRIVER') {
    const allowed = [
      OrderStatus.ON_THE_WAY,
      OrderStatus.DELIVERED,
    ];

    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        'Driver cannot set this order status',
      );
    }

    if (dto.driverId) {
      order.driver = { id: dto.driverId } as any;
    }
  }

  order.status = dto.status;
  return this.orderRepository.save(order);


}}


