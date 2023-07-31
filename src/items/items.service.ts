import { Injectable } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination';
import { SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>) { }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({...createItemInput, user});
    return await this.itemsRepository.save(newItem);
  }

  async findAll(user:User, pagination:PaginationArgs, searchArg: SearchArgs): Promise<Item[]> {
    const { limit, offset } = pagination;
    const { search } = searchArg
    console.log(user.id)
   try {
    const queryBuilder = this.itemsRepository.createQueryBuilder()
    .take( limit )
    .skip( offset )
    .where(` "userId" = :user`, {user:user.id})
    
    if( search ){
      queryBuilder.andWhere('LOWER(name) like :name',{name : `%${search.toLowerCase()}%`})
    }

    return await queryBuilder.getMany(); 
   } catch (error) {
    throw new Error(error.message)
   } 
  }

  async findOne(id: string, user: User): Promise<Item> {
    try {
      const item = await this.itemsRepository.findOneBy({id: id, user:{id:user.id}})
      return item;
    } catch (error) {
      console.error('Your error on findOne',error);
      throw new Error ('Item not find');
    }
  }

  async update(id: string, updateItemInput: UpdateItemInput, user:User): Promise<Item> {
    const item = await this.itemsRepository.preload({...updateItemInput, user})
    return await this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {

    try {
      const item = await this.itemsRepository.findOneBy({id: id, user:{id:user.id}})
      await this.itemsRepository.remove(item);
      return {...item, id}; 
    } catch (error) {
      console.error('Your error on findOne',error);
      throw new Error ('Item not find');
    }
  }

  async itemCount(user: User): Promise<number>{
    return await this.itemsRepository.count({
      where:{
        user:{
          id: user.id
        }
      }
    });
  }
}
