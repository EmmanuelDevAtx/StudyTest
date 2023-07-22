import { Injectable } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>) { }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({...createItemInput, user});
    console.log('tu item, es', newItem);
    return await this.itemsRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    return await this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    return await this.itemsRepository.findOneBy({ id: id });
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemsRepository.preload(updateItemInput)
    return await this.itemsRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({id})
    await this.itemsRepository.remove(item);
    return {...item, id};
  }
}
