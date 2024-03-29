import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext: GqlExecutionContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext['user'];
    const haveUser: boolean = !!user;
    return haveUser;
  }
}
