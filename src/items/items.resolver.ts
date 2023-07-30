import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

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
  ):Promise<Item[]> {
    return await this.itemsService.findAll(user);
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
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user:User,
    ): Promise<Item>{
    return await this.itemsService.remove(id, user);
  }
}
function UserGuards(): (target: typeof ItemsResolver) => void | typeof ItemsResolver {
  throw new Error('Function not implemented.');
}

