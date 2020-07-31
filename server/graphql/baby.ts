import 'reflect-metadata';
import { Resolver, Query, Mutation } from 'type-graphql';
import { Baby } from '../models';
import { babyService } from '../services';

@Resolver()
export default class {
  @Query(() => String)
  list(): string {
    return `healthy`;
  }
  @Mutation(() => Baby)
  async create(): Promise<Baby> {
    return babyService.create()
  }
}
