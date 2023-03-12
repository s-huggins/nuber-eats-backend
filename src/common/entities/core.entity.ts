import { Field, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  public id: number;

  @CreateDateColumn()
  @Field(type => Date)
  public createdAt: Date;

  @UpdateDateColumn()
  @Field(type => Date)
  public updatedAt: Date;
}
