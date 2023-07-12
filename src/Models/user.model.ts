import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.model";

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

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  userType: UserRole;
}
