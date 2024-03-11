import {
  InputType,
  ObjectType,
  Field,
  ObjectTypeOptions,
  FieldOptions,
  registerEnumType,
  InputTypeOptions,
} from "type-graphql";
import {
  EnumConfig,
  MethodAndPropDecorator,
  ReturnTypeFunc,
} from "type-graphql/build/typings/decorators/types";

export function GraphqlEntity(): ClassDecorator;
export function GraphqlEntity(options: ObjectTypeOptions): ClassDecorator;
export function GraphqlEntity(
  name: string,
  options?: ObjectTypeOptions,
): ClassDecorator;
export function GraphqlEntity(
  nameOrOptions?: any,
  options?: any,
): ClassDecorator {
  return ObjectType(nameOrOptions, options);
}

export function GraphqlField(): MethodAndPropDecorator;
export function GraphqlField(options: FieldOptions): MethodAndPropDecorator;
export function GraphqlField(
  returnTypeFunction?: ReturnTypeFunc,
  options?: FieldOptions,
): MethodAndPropDecorator;
export function GraphqlField(
  returnTypeFunctionOrOptions?: any,
  options?: any,
): MethodAndPropDecorator {
  return Field(returnTypeFunctionOrOptions, options);
}

export function GraphqlInputType(): ClassDecorator;
export function GraphqlInputType(options: InputTypeOptions): ClassDecorator;
export function GraphqlInputType(
  name: string,
  options?: InputTypeOptions,
): ClassDecorator;
export function GraphqlInputType(
  nameOrOptions?: any,
  options?: any,
): ClassDecorator {
  return InputType(nameOrOptions, options);
}

export function graphqlRegisterEnumType<TEnum extends Record<string, any>>(
  enumObj: TEnum,
  enumConfig: EnumConfig<TEnum>,
): void {
  registerEnumType(enumObj, enumConfig);
}

export { Int, Float, ClassType } from "type-graphql";
