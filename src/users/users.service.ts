import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';

import { UpdateUserInput } from './dto/update-user.input';
import { SigupInput } from 'src/auth/dto/inputs/singup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as brypt from 'bcrypt'
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class UsersService {

  private logger: Logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>) { }

  async create(signupInput: SigupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: brypt.hashSync(signupInput.password, 10)
      })
      return await this.usersRepository.save(newUser)
    } catch (e) {
      this.handleDBErrors(e)
    }
  }

  async findAll(roles: ValidRoles[], pagination: PaginationArgs, searchArgs: SearchArgs): Promise<User[]> {
    if (roles.length === 0) return await this.usersRepository.find();
    const { search } = searchArgs
    const queryBuilder = this.usersRepository.createQueryBuilder()
      .take( pagination.limit)
      .offset( pagination.offset)
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)

    if( search ){
      queryBuilder.andWhere('LOWER(fullName) like: fullName',{fullName : `%${search.toLowerCase()}%`})
    }
    return await queryBuilder.getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErrors(error);
    }
    return;
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBErrors(error);
    }
    return;
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput, 
    lastUpdateBy: User): Promise<User> {

    try {
      const user = await this.usersRepository.preload({ ...updateUserInput, id });
      user.lastUpdateBy = lastUpdateBy
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error)
    }
    return
  }

  async blockUser(id: string, user: User): Promise<User> {

    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = user;

    return await this.usersRepository.save(userToBlock);
  }

  private handleDBErrors(error: any): never {
    this.logger.error(error);
    if (error.code = '23505' || error.code == 'error-001') {
      throw new BadRequestException(error.detail.replace('Key', ''))
    }
    throw new InternalServerErrorException('Please check server logs');

  }
}
