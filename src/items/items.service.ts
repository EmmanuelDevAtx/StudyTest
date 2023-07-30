import { Injectable } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>) { }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({...createItemInput, user});
    return await this.itemsRepository.save(newItem);
  }

  async findAll(user:User, pagination:PaginationArgs): Promise<Item[]> {
    const { limit, offset } = pagination
    return await this.itemsRepository.find({
      take: limit,
      skip: offset,
      where:{
        user:{
          id: user.id
        }
      }
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    try {
      console.log('1f23aef2-0cb7-4af2-a8f5-2abd2a85b1c1 === ', user.id)
      const item = await this.itemsRepository.findOneBy({id: id, user:{id:user.id}})
      console.log(item)
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
