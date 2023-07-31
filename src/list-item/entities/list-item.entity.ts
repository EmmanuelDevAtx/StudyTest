import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ListItem {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
