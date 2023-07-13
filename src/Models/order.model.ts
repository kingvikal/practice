import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.model";
import { OrderItem } from "./orderItem.model";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: new Date() })
  orderDate: Date;

  @Column()
  totalPrice: number;

  @Column()
  shippedTo: string;

  @Column()
  country: string;

  @ManyToOne(() => User, (user) => user.order)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem[];
}
