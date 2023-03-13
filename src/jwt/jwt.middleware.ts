import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserProfileOutput } from 'src/users/dtos/user-profile.dto';
import { UserService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly _jwtService: JwtService, private readonly _userService: UserService) {}

  /**
   * Attaches the user object to the request
   */
  public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if ('x-jwt' in req.headers) {
      const token: string | string[] = req.headers['x-jwt'];
      try {
        const decoded: string | JwtPayload = this._jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const userLookup: UserProfileOutput = await this._userService.findById(decoded['id']);
          req['user'] = userLookup.user;
        }
      } catch (err) {}
    }
    next();
  }
}
