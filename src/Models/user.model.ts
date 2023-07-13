import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.model";
import { Rating } from "./rating.model";
import { Order } from "./order.model";

enum UserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  USER = "user",
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  city: string;

  @Column()
  age: number;

  @Column()
  contact: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  password: string;

  @OneToMany(() => Rating, (rating) => rating.user)
  rating: Rating[];

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  userType: UserRole;
}
