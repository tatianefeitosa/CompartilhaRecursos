import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { User } from "./user";
import { Post } from "./Post";

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  motivo!: string;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: "CASCADE" })
  denunciante!: User;

  @ManyToOne(() => Post, (post) => post.reports, { onDelete: "CASCADE" })
  post!: Post;

  @CreateDateColumn()
  criadoEm!: Date;
}
