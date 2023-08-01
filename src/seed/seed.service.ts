import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LIST, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListItemService } from 'src/list-item/list-item.service';
import { ListsService } from 'src/lists/lists.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,

        @InjectRepository(List)
        private readonly listRepository: Repository<List>,

        readonly userService: UsersService,
        readonly itemService: ItemsService,
        readonly listItemService: ListItemService,
        readonly listService : ListsService
    ){
        this.isProd = configService.get('STATE') === 'prod'
    }


    async dropDataBase(){

        await this.listItemRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();

        await this.listRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();

        await this.itemsRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();

        await this.userRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
    }
    async executeSeed():Promise<boolean>{   
        if(this.isProd){
            throw new UnauthorizedException('No se puede correr el seed en producción')
        }
        //Delete database
        await this.dropDataBase();

        //Crear usuarios
        const user = await this.loadUsers();

        //Crear items
        try {
            await this.loadItems(user)
        } catch (error) {
            console.log('erroes', error);
        }

        //Crear listas

        const list = await this.loadList( user );

        //Crear items de listas
        const items : Item[] = await this.itemService.findAll(user, { limit :15, offset: 0}, {})
        await this.listItems(list, items);

        return true
    }
    
    async loadUsers ():Promise<User> {
        const users = await SEED_USERS.map(async (item)=>{
            return await this.userService.create(item)
            
        });
        await Promise.all( users )
        return users[0]
    }

    async loadItems (user : User):Promise<void> {
        const itemArray = [];
        await SEED_ITEMS.map(async (item)=>{
            itemArray.push( await this.itemService.create(item, user));
        });
        await Promise.all( itemArray );
    }

    async loadList(user : User): Promise<List>{
        const lists = await SEED_LIST.map(async (list)=>{
            return await this.listService.create(list, user)
            
        });
        await Promise.all( lists )
        return lists[0];
    }

    async listItems(list:List, items:Item[]):Promise<void>{
        items.map(async (item)=>{
            await this.listItemService.create({
                completed: Math.round( Math.random() * 1) == 0? false: true,
                itemId : item.id,
                listId: list.id,
                quantity: Math.round( Math.random() * 10)
            })
        })
    }
}
