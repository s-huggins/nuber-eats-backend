import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly _repository: Repository<User>,
    private readonly _jwtService: JwtService
  ) {}

  public async createAccount({ email, password, role }: CreateAccountInput): Promise<[boolean, string?]> {
    // Golang error response pattern
    let user: User;
    let ok: boolean = true;
    let errorResponse: string;
    try {
      // confirm this is a new user
      user = await this._repository.findOneBy({ email });
      const userAlreadyExists: boolean = !!user;
      if (userAlreadyExists) {
        ok = false;
        errorResponse = 'There is a user with that email already';
      } else {
        user = this._repository.create({ email, password, role });
        await this._repository.save(user);
      }
    } catch (error) {
      ok = false;
      errorResponse = "Couldn't create account";
    }
    return [ok, errorResponse];
  }

  public async login({ email, password }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // find the user with email
    // check if the password is correct
    // make a JWT and return it to the user
    let response;
    try {
      const user: User = await this._repository.findOneBy({ email });
      const userExists: boolean = !!user;
      if (!userExists) {
        response = {
          ok: false,
          error: 'User not found'
        };
      } else {
        const passwordCorrect: boolean = await user.checkPassword(password);
        if (!passwordCorrect) {
          response = {
            ok: false,
            error: 'Wrong password'
          };
        } else {
          const token: string = this._jwtService.sign(user.id);
          response = {
            ok: true,
            token
          };
        }
      }
    } catch (error) {
      response = {
        ok: false,
        error
      };
    }
    return response;
  }

  public async findById(id: number): Promise<User> {
    return this._repository.findOneBy({ id });
  }
}
