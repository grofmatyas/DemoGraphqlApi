import {
  Entity,
  PrimaryKey,
  Property,
  EntityOptions,
  Dictionary,
  PrimaryKeyOptions,
  PropertyOptions,
  ManyToMany,
  ManyToManyOptions,
  EntityName,
  Collection,
  Enum,
  EnumOptions,
  AnyEntity,
  Index,
  Unique,
  IndexOptions,
  UniqueOptions,
} from "@mikro-orm/core";

export function OrmIndex<T>(
  options?: IndexOptions<T>,
): (target: Partial<any>, propertyName?: string | undefined) => any {
  return Index(options);
}

export function OrmUnique<T>(
  options?: UniqueOptions<T>,
): (target: Partial<any>, propertyName?: string | undefined) => any {
  return Unique(options);
}

export function OrmEntity(
  options: EntityOptions<any> = {},
): <T>(target: T & Dictionary) => T & Dictionary {
  return Entity(options);
}

export function OrmPrimaryKey<T extends Record<string, any>>(
  options?: PrimaryKeyOptions<T>,
): (target: Partial<any>, propertyName: string) => any {
  return PrimaryKey(options);
}

export function OrmProperty<T extends Record<string, any>>(
  options?: PropertyOptions<any>,
): (target: any, propertyName: string) => any {
  return Property<T>(options);
}

export function OrmEnum<T extends Record<string, any>>(
  options?: EnumOptions<AnyEntity> | (() => Dictionary),
): (target: any, propertyName: string) => any {
  return Enum<T>(options);
}

export function OrmManyToMany<T extends Record<string, any>, O>(
  entity?: ManyToManyOptions<T, O> | string | (() => EntityName<T>),
  mappedBy?: (string & keyof T) | ((e: T) => any),
  options?: Partial<ManyToManyOptions<T, O>>,
): (target: AnyEntity, propertyName: string) => any {
  return ManyToMany<T, O>(entity, mappedBy, options);
}

export class OrmCollection<
  T extends Record<string, any>,
  O extends Record<string, any> = Record<string, any>,
> extends Collection<T, O> {}
