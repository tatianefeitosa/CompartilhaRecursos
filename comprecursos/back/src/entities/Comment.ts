import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { User } from "./user";
import { Post } from "./Post";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  texto!: string;

  @ManyToOne(() => User, (user) => user.comentarios, { onDelete: "CASCADE" })
  autor!: User;

  @ManyToOne(() => Post, (post) => post.comentarios, { onDelete: "CASCADE" })
  post!: Post;

  @CreateDateColumn()
  criadoEm!: Date;
}
