import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(Verification) private readonly _verificationRepository: Repository<Verification>,
    private readonly _jwtService: JwtService
  ) {}

  public async createAccount({ email, password, role }: CreateAccountInput): Promise<CreateAccountOutput> {
    let ok: boolean = false;
    let error: string = 'Failed to create account';
    try {
      // confirm this is a new user
      let user: User = await this._userRepository.findOneBy({ email });
      const userAlreadyExists: boolean = !!user;
      if (userAlreadyExists) {
        error = 'User already exists';
        throw new Error(error);
      }

      user = this._userRepository.create({ email, password, role });
      user = await this._userRepository.save(user);
      await this._verificationRepository.save(this._verificationRepository.create({ user }));
      ok = true;
      error = null;
    } catch (error) {
      ok = false;
    }
    return { ok, error };
  }

  public async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // find the user with email
    // check if the password is correct
    // make a JWT and return it to the user
    let ok: boolean = false;
    let error: string = 'Failed to log in';
    let token: string;
    try {
      const user: User = await this._userRepository.findOne({ where: { email }, select: ['id', 'password'] });
      const userExists: boolean = !!user;
      if (!userExists) {
        error = "User doesn't exist";
        throw new Error(error);
      }

      const passwordCorrect: boolean = await user.checkPassword(password);
      if (!passwordCorrect) {
        error = 'Incorrect password';
        throw new Error(error);
      }

      token = this._jwtService.sign(user.id);
      ok = true;
      error = null;
    } catch (error) {
      ok = false;
    }
    return { ok, error, token };
  }

  public async findById(id: number): Promise<UserProfileOutput> {
    let ok: boolean = false;
    let error: string = 'Failed to find user';
    let user: User;
    try {
      user = await this._userRepository.findOneBy({ id });
      if (!user) {
        error = 'User not found';
        throw new Error(error);
      }
      ok = true;
      error = null;
    } catch (err) {
      ok = false;
    }
    return { ok, error, user };
  }

  public async editProfile(userId: number, { email, password }: EditProfileInput): Promise<EditProfileOutput> {
    let ok: boolean = false;
    let error: string = 'Failed to update profile';
    try {
      const userLookup: UserProfileOutput = await this.findById(userId);
      if (!userLookup.ok) {
        throw new Error('User not found');
      }

      const user: User = userLookup.user;
      if (email) {
        user.email = email;
        user.verified = false;
        await this._verificationRepository.save(this._verificationRepository.create({ user }));
      }
      if (password) {
        user.password = password;
      }
      await this._userRepository.save(user);
      ok = true;
      error = null;
    } catch (error) {
      ok = false;
    }
    return { ok, error };
  }

  public async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    let ok: boolean;
    let error: string = 'Failed to verify email';
    try {
      const verification: Verification = await this._verificationRepository.findOne({
        where: { code },
        relations: ['user']
      });
      if (!verification) {
        throw new Error(error);
      }
      verification.user.verified = true;
      await this._userRepository.save(verification.user);
      await this._verificationRepository.delete(verification.id);
      ok = true;
      error = null;
    } catch (error) {
      ok = false;
    }
    return { ok, error };
  }
}
