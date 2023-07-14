import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category.model";
import { Rating } from "./rating.model";
import { Order } from "./order.model";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  totalPrice: number;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => Rating, (rating) => rating.product)
  rating: Rating[];

  @ManyToOne(() => Category, (category) => category.product, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  parentCategory: Category;

  @OneToMany(() => Order, (order) => order.product)
  order: Order[];

  @Column({ nullable: true, name: "avg_rate" })
  avgRate: number;
}
