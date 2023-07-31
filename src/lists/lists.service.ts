import { Injectable } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>
  ){}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listRepository.create({...createListInput, user});
    return await this.listRepository.save(newList);
  }

  async findAll(user: User, paginationArgs:PaginationArgs, searchArgs: SearchArgs):Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    try {
      const createQueryBuilder = this.listRepository.createQueryBuilder()
    .take(limit)
    .skip(offset)
    .where( `"userId" = :user` , { user:user.id})


    if( search ){
      createQueryBuilder.andWhere('LOWER(name) like :nombre',{nombre : `%${search.toLowerCase()}%`})
    } 
    return  await createQueryBuilder.getMany();

    } catch (error) {
      throw new Error(error.message)
    }
  }

  async findOne(id: string, user: User):Promise<List> {
    try {
      const listReponse = await this.listRepository.findOneBy({id, user:{
        id: user.id
      }})
      return listReponse 
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async update(updateListInput: UpdateListInput,user: User):Promise<List> {
    try {
      const isValidUser = this.listRepository.findOneBy({user:{id:user.id}});

      if( !isValidUser ) throw new Error ('User is not valid')

      const list = await this.listRepository.preload({...updateListInput, user})
      list.lastUpdateBy = user;
      return await this.listRepository.save(list)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async remove(id: string, user: User):Promise<List> {
    try {
      const listReponse = await this.listRepository.findOneBy({id, user:{
        id: user.id
      }})
      await this.listRepository.remove(listReponse)
      return {...listReponse, id} 
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
