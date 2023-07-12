import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { DocTypeEnum, DocumentTypeEnum } from "../Utils/enums";

@Entity()
export class UserDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: DocumentTypeEnum })
  type: DocumentTypeEnum;

  @Column()
  value: string;

  @Column({ type: "enum", enum: DocTypeEnum })
  docType: DocTypeEnum;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;
}
