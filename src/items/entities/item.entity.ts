import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items'})
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field( ()=> ID)
  id: string;

  @Column()
  @Field(()=> String)
  name:string;

  @Column({ nullable : true})
  @Field(()=> String, { nullable: true})
  quantityUnits?: string;

  @ManyToOne( ()=>  User, (user) => user.lists, { nullable: true  } )
  @Index('userId-index')
  @Field(() => User)
  user:User;

  @OneToMany(()=> ListItem, (listItem) => listItem.list, {lazy: true})
  
  listItem: ListItem[]
}
