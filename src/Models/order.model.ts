import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.model";
import { Product } from "./product.model";
import { OrderStatus } from "../Utils/enums";
import { ShippingDetails } from "../Utils/interface";
import { OrderItem } from "./orderItem.model";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderDate: Date;

  @Column({ nullable: true })
  totalPrice: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PLACED })
  status: OrderStatus;

  @Column({ nullable: true })
  shippingCharge: number;

  @Column("jsonb", { nullable: true })
  shippingAddress: ShippingDetails;

  @ManyToOne(() => User, (user) => user.order)
  user: User;
}
