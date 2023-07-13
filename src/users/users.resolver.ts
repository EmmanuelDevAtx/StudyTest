import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@UseGuards( JwtAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}


  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User,
  ):Promise<User[]> {
    return await this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
    ):Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser'})
  async updateUser
  (@Args('updateUserInput') updateUserInput: UpdateUserInput,
  @CurrentUser([ValidRoles.admin]) user: User,
  ):Promise<User> {
    
    return await this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  // @Mutation(() => User)
  // async removeUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
  //   return await this.usersService.blockUser(id);
  // }

  @Mutation(() => User, {name: 'blockUser'})
  async blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ):Promise<User>{
    return await this.usersService.blockUser(id, user);
  }

}
