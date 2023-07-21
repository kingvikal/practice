import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.model";
import { Cart } from "./cart.model";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column()
  quantity: number;

  @Column()
  total: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItem)
  @JoinColumn()
  cart: Cart;
}
