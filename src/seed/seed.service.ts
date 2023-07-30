import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
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

        //Crear items
        return true
    }   
}
