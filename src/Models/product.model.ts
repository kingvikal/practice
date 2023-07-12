import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.model";
import { Rating } from "./rating.model";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  unit: number;

  @Column()
  totalPrice: number;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => Rating, (rating) => rating.product)
  rating: Rating[];

  @ManyToOne(() => Category, (category) => category.product, {
    onDelete: "CASCADE",
  })
  category: Category;
}
