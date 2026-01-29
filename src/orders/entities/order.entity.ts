import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';      
import { OrderStatus } from '../order-status.enum';  
import { OrderItem } from './order-item.entity';
import { OneToMany } from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
  
  @Column('decimal')
  total: number;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne(() => User, user => user.driverOrders, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: User;


  @ManyToOne(() => User)
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;

  
  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];

   
}
