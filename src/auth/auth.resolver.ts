import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SigupInput } from './dto/inputs/singup.input';
import { LoginResponse } from './dto/types/login-response-type';
import { LoginInput } from './dto/inputs/login.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  
  @Mutation(()=> LoginResponse)
  async signup(@Args('singupInput')singupInput: SigupInput):Promise<LoginResponse>{
    return await this.authService.singup(singupInput);
  }

  @Mutation(()=> LoginResponse ,{name: 'login'})
  async login(@Args('loginInput') loginInput: LoginInput): Promise<LoginResponse>{
    return await this.authService.login(loginInput);
  }

  @UseGuards( JwtAuthGuard )
  @Query(() => LoginResponse, { name: 'relative'})
  relativeToken(
    @CurrentUser() user: User
  ): LoginResponse{
    return this.authService.relativeToken( user );
  }

}
