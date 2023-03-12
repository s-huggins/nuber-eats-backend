import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly _options: JwtModuleOptions) {}

  public sign(userId: number): string {
    return jwt.sign({ id: userId }, this._options.privateKey);
  }

  public verify(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, this._options.privateKey);
  }
}
