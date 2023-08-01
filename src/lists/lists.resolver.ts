import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';

@Resolver(() => List)
@UseGuards( JwtAuthGuard )
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listsItemsService: ListItemService,
    ) {}

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

  @ResolveField( ()=> [ListItem], { name: 'items'})
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() serachArgs:SearchArgs
  ): Promise<ListItem[]>{
    return await this.listsItemsService.findAll(list, paginationArgs, serachArgs)
  }

  @ResolveField(()=> Int, {name:'totalItems'})
  async countListItemByList(
    @Parent() list:List
  ):Promise<Number>{
    return await this.listsItemsService.countAll(list);
  }
}
