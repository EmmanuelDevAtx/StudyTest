import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';

import { UpdateUserInput } from './dto/update-user.input';
import { SigupInput } from 'src/auth/dto/inputs/singup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as brypt from 'bcrypt'

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

  async findAll(): Promise<User[]> {
    return [];
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

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async blockUser(id: number): Promise<User> {
    return;
  }

  private handleDBErrors(error: any): never {
    this.logger.error(error);
    if (error.code = '23505' || error.code == 'error-001') {
      throw new BadRequestException(error.detail.replace('Key', ''))
    }
    throw new InternalServerErrorException('Please check server logs');

  }
}
