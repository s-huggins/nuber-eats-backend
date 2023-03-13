import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field(type => String)
  public code: string;

  // cascade user deletion to delete verification
  @OneToOne(type => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User;

  @BeforeInsert()
  public createCode(): void {
    this.code = uuidv4();
  }
}
