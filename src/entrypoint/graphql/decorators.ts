import { GraphQLSchema } from "graphql";
import {
  Arg,
  Ctx,
  Resolver,
  ClassType,
  Query,
  ParameterDecorator,
  ArgOptions,
  Mutation,
  buildSchema,
  BuildSchemaOptions,
} from "type-graphql";
import {
  ReturnTypeFunc,
  ClassTypeResolver,
  AdvancedOptions,
} from "type-graphql/build/typings/decorators/types";

export function GraphqlResolver(): ClassDecorator;
export function GraphqlResolver(typeFunc: ClassTypeResolver): ClassDecorator;
export function GraphqlResolver(objectType: ClassType): ClassDecorator;
export function GraphqlResolver(objectTypeOrTypeFunc?: any): ClassDecorator {
  return Resolver(objectTypeOrTypeFunc);
}

export function GraphqlQuery(): MethodDecorator;
export function GraphqlQuery(options: AdvancedOptions): MethodDecorator;
export function GraphqlQuery(
  returnTypeFunc: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodDecorator;
export function GraphqlQuery(
  returnTypeFuncOrOptions?: any,
  options?: any,
): MethodDecorator {
  return Query(returnTypeFuncOrOptions, options);
}

export function GraphqlMutation(): MethodDecorator;
export function GraphqlMutation(options: AdvancedOptions): MethodDecorator;
export function GraphqlMutation(
  returnTypeFunc: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodDecorator;
export function GraphqlMutation(
  returnTypeFuncOrOptions?: any,
  options?: any,
): MethodDecorator {
  return Mutation(returnTypeFuncOrOptions, options);
}

export function GraphqlCtx(propertyName?: string): ParameterDecorator {
  return Ctx(propertyName);
}

export function GraphqlArg(
  name: string,
  options?: ArgOptions,
): ParameterDecorator;
export function GraphqlArg(
  name: string,
  returnTypeFunc: ReturnTypeFunc,
  options?: ArgOptions,
): ParameterDecorator;
export function GraphqlArg(
  name: string,
  returnTypeFuncOrOptions?: any,
  options?: any,
): ParameterDecorator {
  return Arg(name, returnTypeFuncOrOptions, options);
}

export function buildGraphqlSchema(
  options: BuildSchemaOptions,
): Promise<GraphQLSchema> {
  return buildSchema(options);
}

export { NonEmptyArray } from "type-graphql";
