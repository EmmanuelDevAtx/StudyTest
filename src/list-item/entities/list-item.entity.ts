import { ObjectType, Field } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listItems')
@ObjectType()
export class ListItem {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(()=> String)
  id: string

  @Column({ type : 'numeric'})
  @Field(()=> Number, { name:'quantity'})
  quantity: number 


  @Column({ type : 'boolean'})
  @Field(()=> Boolean, { name: 'completed'})
  completed: boolean

  //Estas son relaciones 
  @ManyToOne(() => List, (list)=> list.listItem, {lazy :true })
  @Field(()=> List)
  list: List

  // item: Item
  @ManyToOne(()=> Item, (item)=> item.listItem, {lazy: true})
  @Field(()=> Item)
  item: Item

}
