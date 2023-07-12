import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Product } from "./product.model";
import { User } from "./user.model";

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @ManyToOne(() => User, (user) => user.rating, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Product, (product) => product.rating)
  product: Product;
}
