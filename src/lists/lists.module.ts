import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';

@Module({
  providers: [
    ListsResolver, 
    ListsService
  ],
  imports: [ 
    TypeOrmModule.forFeature([ List ])],
  exports: [
    ListsService,
    TypeOrmModule
  ]
})
export class ListsModule {}
