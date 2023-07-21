import {
  Collection,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.model";
import { Order } from "./order.model";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @ManyToOne(() => Order)
  @JoinColumn()
  order: Order;
}
