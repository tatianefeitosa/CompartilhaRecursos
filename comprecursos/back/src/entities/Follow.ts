import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { User } from "./user";

@Entity("follows")
export class Follow {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.seguindo, { onDelete: "CASCADE" })
  seguidor!: User;

  @ManyToOne(() => User, (user) => user.seguidores, { onDelete: "CASCADE" })
  seguido!: User;
}
