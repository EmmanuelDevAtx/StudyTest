import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @IsString()
  @Field(() => String)
  id: string;

  @Field(()=> String)
  @IsString()
  name:string;

  @Field(()=> String, {nullable : true})
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
