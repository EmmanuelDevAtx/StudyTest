import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists'})
@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( ()=> ID)
  id: string

  @Column()
  @Field(()=> String)
  name:string

  @ManyToOne( ()=>  User, (user) => user.items, { nullable: true  } )
  @Field( () => User)
  @Index('userId-list-index')
  user: User
}
