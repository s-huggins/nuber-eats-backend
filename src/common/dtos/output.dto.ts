import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field(type => String, { nullable: true })
  public error?: string;

  @Field(type => Boolean)
  public ok: boolean;
}
