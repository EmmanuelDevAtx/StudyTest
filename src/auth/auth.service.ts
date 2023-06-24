import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SigupInput } from './dto/inputs/singup.input';
import { LoginResponse } from './dto/types/login-response-type';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  private getJWTtoken(id: string) {
    return this.jwtService.sign({ id })
  }
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

  async singup(input: SigupInput): Promise<LoginResponse> {
    const user = await this.userService.create(input)
    const token = this.getJWTtoken(user.id)
    return { token, user }
  }

  async login(loginInput: LoginInput): Promise<LoginResponse> {
    const user = await this.userService.findOneByEmail(loginInput.email);
    if (!bcrypt.compareSync(loginInput.password, user.password)) {
      throw new BadRequestException('Email/ Pasword do not match')
    }
    const token = this.getJWTtoken(user.id)
    return {
      token,
      user
    }
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    
    if(!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin')
    
    delete user.password
    return user
  }

  relativeToken(user: User) : LoginResponse{
    const token = this.getJWTtoken( user.id );
    return { token, user}
  }
}
