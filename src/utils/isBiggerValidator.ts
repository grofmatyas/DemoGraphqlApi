import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsBiggerThan(
  property: string,
  validationOptions?: ValidationOptions,
  propertyTypeOf: string = "number",
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: "isBiggerThan",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === propertyTypeOf &&
            typeof relatedValue === propertyTypeOf &&
            value > relatedValue
          );
        },
      },
    });
  };
}
