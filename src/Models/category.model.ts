import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryType } from "../Utils/enums";
import { Product } from "./product.model";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: CategoryType })
  categoryType: CategoryType;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}
