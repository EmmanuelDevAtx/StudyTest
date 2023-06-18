import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items'})
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field( ()=> ID)
  id: string;

  @Column()
  @Field(()=> String)
  name:string;

  @Column()
  @Field(()=> Int)
  quantity: number;

  @Column({ nullable : true})
  @Field(()=> String, { nullable: true})
  quantityUnits?: string;
}
