import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[]

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isActive?: boolean;
}
