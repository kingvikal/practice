import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.model";
// import { CategoryType } from "../Utils/enums";
// import { Product } from "./product.model";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  categoryName: string;

  @ManyToOne((type) => Category, (category) => category.childCategory)
  parentCategory: Category;

  @OneToMany((type) => Category, (category) => category.parentCategory)
  childCategory: Category[];

  @OneToMany(() => Product, (product) => product.parentCategory)
  @JoinTable()
  product: Product[];
}
