import { InputType, Int, Field} from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field(()=> String)
  @IsString()
  name:string;

  @Field(()=> Int)
  @IsInt()
  @IsPositive()
  quantity: number;

  @Field(()=> String, {nullable : true})
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
