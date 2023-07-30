import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        readonly userService: UsersService,
        readonly itemService: ItemsService,
    ){
        this.isProd = configService.get('STATE') === 'prod'
    }


    async dropDataBase(){
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

        return true
    }
    
    async loadUsers ():Promise<User> {
        const users = [];

        await SEED_USERS.map(async (item)=>{
           users.push( await this.userService.create(item))
        });
        return users[0]
    }

    async loadItems (user : User):Promise<void> {
        const itemArray = [];

        await SEED_ITEMS.map(async (item)=>{
            itemArray.push( await this.itemService.create(item, user));
        });
        await Promise.all( itemArray );
    }
}
