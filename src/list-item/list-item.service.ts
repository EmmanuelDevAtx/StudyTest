import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { Repository } from 'typeorm';
import { ListItem } from './entities/list-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository( ListItem )
    private readonly listItemRepository: Repository<ListItem>
  ){}

  async create(createListItemInput: CreateListItemInput):Promise<ListItem> {

    const {itemId, listId, ...rest } = createListItemInput;

    const newListItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    })
    await await this.listItemRepository.save( newListItem )
    return await this.findOne( newListItem.id );
  }

  async findAll(list: List, paginationArgs:PaginationArgs, searchArgs: SearchArgs):Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    try {
      const createQueryBuilder = this.listItemRepository.createQueryBuilder()
    .take(limit)
    .skip(offset)
    .where( `"listId" = :listId` , { listId: list.id})


    if( search ){
      createQueryBuilder.andWhere('LOWER(name) like :nombre',{nombre : `%${search.toLowerCase()}%`})
    } 
    return  await createQueryBuilder.getMany();

    } catch (error) {
      throw new Error(error.message)
    }
  }

  async findOne(id: string):Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({id})

    if(!listItem) throw new NotFoundException()

    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput):Promise<ListItem> {
    const {itemId, listId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemRepository.createQueryBuilder()
    .update()
    .set( rest )
    .where('id = :id',{ id });

    if( itemId ) queryBuilder.set({ item : { id: itemId}});
    if( listId ) queryBuilder.set({ list : { id: listId}});

    await queryBuilder.execute();
    return await this.findOne( id );
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async countAll (list:List):Promise<Number>{
    return await this.listItemRepository.count({where:{
      list:{
        id: list.id
      }
    }}) 
  }
}
