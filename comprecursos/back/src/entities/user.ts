import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

/*import { Produto } from "./Produto";
import { Favorito } from "./Favorito";*/

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

  /*@OneToMany(() => Produto, (produto) => produto.user)
    produtos!: Produto[];
    @OneToMany(() => Favorito, (favorito) => favorito.user)
    favoritos!: Favorito[];*/
}
