import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
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
    return this._userService.createAccount(createAccountInput);
  }

  @Mutation(returns => LoginOutput)
  public async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this._userService.login(loginInput);
  }

  @Query(returns => User)
  @UseGuards(AuthGuard)
  public me(@AuthUser() authUser: User): User {
    return authUser;
  }

  @Query(returns => UserProfileOutput)
  @UseGuards(AuthGuard)
  public async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
    return this._userService.findById(userProfileInput.userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => EditProfileOutput)
  public async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput
  ): Promise<EditProfileOutput> {
    return this._userService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation(returns => VerifyEmailOutput)
  public async verifyEmail(@Args('input') { code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    return this._userService.verifyEmail(code);
  }
}
