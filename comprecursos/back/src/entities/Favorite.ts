import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { Post } from "./Post";

@Entity("favorites")
export class Favorite {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.favoritos, { onDelete: "CASCADE" })
  usuario!: User;

  @ManyToOne(() => Post, (post) => post.favoritos, { onDelete: "CASCADE" })
  post!: Post;
}
