import { Injectable, Type } from '@nestjs/common';
import { Policy } from './interfaces/policy.interface';
import { PolicyHandler } from './interfaces/policy-handler.interface';

@Injectable()
export class PolicyHandlersStorage {
  private readonly collection = new Map<Type<Policy>, PolicyHandler<any>>();
  add<T extends Policy>(policy: Type<T>, handler: PolicyHandler<T>) {
    this.collection.set(policy, handler);
  }
  get<T extends Policy>(policy: Type<T>): PolicyHandler<T> {
    const handler = this.collection.get(policy);
    if (!handler) {
      throw new Error(`No handler found for policy ${policy.name}`);
    }
    return handler;
  }
}
