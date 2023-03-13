import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

enum UserRole {
  Client,
  Owner,
  Delivery
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsEmail()
  public email: string;

  // don't select password on queries
  @Column({ select: false })
  @Field(type => String)
  public password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(type => UserRole)
  @IsEnum(UserRole)
  public role: UserRole;

  @Column({ default: false })
  @Field(type => Boolean)
  public verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword(): Promise<void> {
    // if this db command has a password on it, then hash the password
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  public async checkPassword(password: string): Promise<boolean> {
    let ok: boolean = false;
    try {
      ok = await bcrypt.compare(password, this.password);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    return ok;
  }
}
