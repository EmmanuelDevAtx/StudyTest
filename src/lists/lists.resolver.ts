import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Resolver(() => List)
@UseGuards( JwtAuthGuard )
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Mutation(() => List, {name : 'createList'})
 async createList(
    @CurrentUser() user : User,
    @Args('createListInput') createListInput: CreateListInput,
    ): Promise<List> {
    return await this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'AllLists' })
  async findAll(
    @CurrentUser() user:User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs : SearchArgs
  ): Promise<List[]> {
    return await this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'findOneList' })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string) {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List, {name: 'updateList'})
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user:User,
    
    ) {
    return this.listsService.update(updateListInput, user);
  }

  @Mutation(() => List, { name: 'removeList'})
  removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
    ) {
    return this.listsService.remove(id, user);
  }
}
