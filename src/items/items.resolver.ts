import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination';
import { SearchArgs } from 'src/common/dto/args';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, {name:"createItem"})
  async createItem(
    @CurrentUser() user:User,
    @Args('createItemInput') createItemInput: CreateItemInput
    ): Promise<Item> {
    return await this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'findAllitems' })
  async findAll(
    @CurrentUser() user:User,
    @Args() pagination:PaginationArgs,
    @Args() search:SearchArgs,
  ):Promise<Item[]> {
    return await this.itemsService.findAll(user, pagination, search);
  }

  @Query(() => Item, { name: 'findItem' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user:User,
    ): Promise<Item> {
    return await this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user:User
    ): Promise<Item> {
    return await this.itemsService.update(updateItemInput.id,updateItemInput, user);
  }

  @Mutation(() => Item)
  async removeItem(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user:User,
    ): Promise<Item>{
    return await this.itemsService.remove(id, user);
  }
}

