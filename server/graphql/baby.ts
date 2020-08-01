import 'reflect-metadata';
import { Resolver, Query, Mutation, Args } from 'type-graphql';
import { Baby } from '../models';
import { babyService } from '../services';

@Resolver()
export class BabySchema {
  @Query(() => String)
  list(): string {
    return `healthy`;
  }
  @Mutation(() => Baby)
  async create(@Args() { name, height, weight, dob }: Baby): Promise<Baby> {
    return babyService.create({ name, height, weight, dob });
  }
}
