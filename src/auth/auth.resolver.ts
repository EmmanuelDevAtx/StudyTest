import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SigupInput } from './dto/inputs/singup.input';
import { LoginResponse } from './dto/types/login-response-type';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  
  @Mutation(()=> LoginResponse)
  async signup(@Args('singupInput')singupInput: SigupInput):Promise<LoginResponse>{
    return await this.authService.singup(singupInput);
  }

  // @Mutation( {name: 'login'})
  // async login(){
  //   return await this.authService.login();
  // }

  // @Query()
  // async revalidateToken(){
  //   return await this.authService.revalidateToken();
  // }

}
