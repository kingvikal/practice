import {
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

  @Column({ nullable: true })
  productName: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Order)
  @JoinColumn()
  order: Order;

  @Column("json", { nullable: true })
  productSnapshot: { productId: number; productName: string; price: number };
}
