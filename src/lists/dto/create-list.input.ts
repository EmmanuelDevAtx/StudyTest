import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class 
CreateListInput {

  @Field(()=> String, {nullable : false})
  @IsString()
  name:string

}
