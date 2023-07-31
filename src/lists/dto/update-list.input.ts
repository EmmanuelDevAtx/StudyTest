import { IsString } from 'class-validator';
import { CreateListInput } from './create-list.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {

  @IsString()
  @Field(() => String)
  id: string;
  
  @Field(()=> String)
  @IsString()
  name:string;
}
