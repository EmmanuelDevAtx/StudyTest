import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists'})
@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( ()=> ID)
  id: string

  @Column()
  @Field(()=> String)
  name:string

  @ManyToOne( ()=>  User, (user) => user.lists, { nullable: true, lazy: true  } )
  @Field( () => User)
  @Index('userId-list-index')
  user: User


  @ManyToOne(()=> User, (user)=> user.lastUpdateBy, {nullable : true, lazy:true})
  @JoinColumn({name :'lastUpdateBy'})
  @Field( () => User, {nullable: true})
  lastUpdateBy?: User;


  @OneToMany(()=> ListItem, (listItem)=> listItem.list, {lazy:true})
  listItem: ListItem[]
}
