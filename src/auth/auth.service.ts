import { Injectable } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SigupInput } from './dto/inputs/singup.input';
import { LoginResponse } from './dto/types/login-response-type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor (private readonly userService: UsersService){}
  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async singup(input: SigupInput):Promise<LoginResponse>{
    const user = await this.userService.create(input)
    const token = 'ABC123'
    return { token , user }
  }
}
