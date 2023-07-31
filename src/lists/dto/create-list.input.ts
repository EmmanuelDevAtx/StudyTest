import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateListInput {

  @Field(()=> String, {nullable : false})
  name:string

}
