import 'reflect-metadata'
import { Resolver, Query } from 'type-graphql'

@Resolver()
export default class {
  @Query(() => String)
  list(): string {
    return `healthy`
  }
}