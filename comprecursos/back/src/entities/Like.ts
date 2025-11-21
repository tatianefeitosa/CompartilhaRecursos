import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { Post } from "./Post";

@Entity("likes")
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  usuario!: User;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: "CASCADE" })
  post!: Post;
}
