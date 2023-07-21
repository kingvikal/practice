import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.model";
import { CartItem } from "./cartItems.model";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  itemsCount: number;

  @Column({ nullable: true })
  subtotal: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItem: CartItem[];
}
