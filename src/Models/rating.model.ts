import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.model";

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  rating: number;

  @Column()
  user: string;

  @ManyToOne(() => Product, (product) => product.rating)
  product: Product;
}
