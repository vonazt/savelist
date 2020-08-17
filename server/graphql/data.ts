import 'reflect-metadata';
import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Data, UpdateData } from '../models';
import { service } from '../services';

@Resolver()
export class DataSchema {
  @Query(() => [Data])
  async list(): Promise<Data[]> {
    return service.list();
  }
  @Mutation(() => Data)
  async create(@Arg(`data`) data: Data): Promise<Data> {
    return service.create(data);
  }
  @Mutation(() => Data)
  async update(@Arg(`id`) id: string, @Arg(`data`) data: UpdateData): Promise<Data> {
    return service.update(id, data)
  }
  @Mutation(() => String)
  async delete(@Arg(`id`) id: string): Promise<string> {
    return service.deleteOne(id)
  }
}
