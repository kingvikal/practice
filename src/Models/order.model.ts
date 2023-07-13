import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.model";
import { Product } from "./product.model";
import { OrderStatus } from "../Utils/enums";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: new Date() })
  orderDate: Date;

  @Column()
  totalPrice: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PLACED })
  status: OrderStatus;

  @Column()
  shippedTo: string;

  @Column()
  country: string;

  @ManyToOne(() => User, (user) => user.order)
  user: User;

  @ManyToOne(() => Product, (product) => product.order)
  product: Product;
}
