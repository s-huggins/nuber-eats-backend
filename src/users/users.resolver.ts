import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  @Query(returns => Boolean)
  public hi() {
    return true;
  }

  @Mutation(returns => CreateAccountOutput)
  public async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
    let response: CreateAccountOutput;
    try {
      const [ok, error]: [boolean, string?] = await this._userService.createAccount(createAccountInput);
      response = {
        ok,
        error
      };
    } catch (error) {
      response = {
        ok: false,
        error
      };
    }
    return response;
  }

  @Mutation(returns => LoginOutput)
  public async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    let response: LoginOutput;
    try {
      const { ok, error, token } = await this._userService.login(loginInput);
      response = { ok, error, token };
    } catch (error) {
      response = { ok: false, error, token: null };
    }
    return response;
  }

  @Query(returns => User)
  @UseGuards(AuthGuard)
  public me(@AuthUser() authUser: User): User {
    console.log(authUser);
    return authUser;
  }

  @Query(returns => UserProfileOutput)
  @UseGuards(AuthGuard)
  public async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
    let userProfileOutput: UserProfileOutput;
    try {
      const user: User = await this._userService.findById(userProfileInput.userId);
      if (!user) {
        throw new Error('User not found');
      }
      userProfileOutput = {
        user,
        ok: true
      };
    } catch (err) {
      userProfileOutput = {
        error: 'User not found',
        ok: false
      };
    }
    return userProfileOutput;
  }
}
