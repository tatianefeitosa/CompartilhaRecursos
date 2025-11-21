import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Post } from "./Post";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Favorite } from "./Favorite";
import { Report } from "./Report";
import { Follow } from "./Follow";

export enum UserRole {
  ESTUDANTE = "estudante",
  PROFESSOR = "professor",
  ADMINISTRADOR = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  senha!: string;

  @Column({
    type: "text",
    default: UserRole.ESTUDANTE,
  })
  role!: UserRole;

    
  @OneToMany(() => Post, (post) => post.autor)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.autor)
  comentarios!: Comment[];

  @OneToMany(() => Like, (like) => like.usuario)
  likes!: Like[];

  @OneToMany(() => Favorite, (fav) => fav.usuario)
  favoritos!: Favorite[];

  @OneToMany(() => Report, (rep) => rep.denunciante)
  reports!: Report[];

  @OneToMany(() => Follow, (follow) => follow.seguidor)
  seguindo!: Follow[];

  @OneToMany(() => Follow, (follow) => follow.seguido)
  seguidores!: Follow[];
}
