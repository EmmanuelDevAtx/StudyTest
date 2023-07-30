import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: 'postgres',
      password: 'algunpassword',
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ AuthModule ],
      inject: [ JwtService ],
      useFactory: async( jwtService: JwtService)=>{
        return {
          playground: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          // context({req}){
          //   const token = req.headers.authorization?.replace('Bearer ','');
          //   if( !token ) throw Error('Token needed');
            
          //   const payload = jwtService.decode(token);
          //   if( !payload ) throw Error('Token not valid');
          // }
        }
      }
    }),
  //   GraphQLModule.forRoot<ApolloDriverConfig>({
  //   driver: ApolloDriver,
  //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  // }), 
  ItemsModule, UsersModule, AuthModule, SeedModule,],
  controllers: [],
  providers: [],
})
export class AppModule {

}
