import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";

import { User } from "./user";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Favorite } from "./Favorite";
import { Report } from "./Report";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  conteudo!: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  autor!: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comentarios!: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes!: Like[];

  @OneToMany(() => Favorite, (fav) => fav.post)
  favoritos!: Favorite[];

  @OneToMany(() => Report, (report) => report.post)
  reports!: Report[];

  @CreateDateColumn()
  criadoEm!: Date;
}
