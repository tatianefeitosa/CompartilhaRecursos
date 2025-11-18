import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("token_blacklist")
export class TokenBlacklist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  token!: string;
  
  @Column({ type: "datetime" })
  expiracao!: Date;
}
