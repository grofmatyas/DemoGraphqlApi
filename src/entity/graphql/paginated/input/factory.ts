import { IsInt, Max, Min, ValidateNested } from "class-validator";

import {
  ClassType,
  GraphqlField,
  GraphqlInputType,
  Int,
} from "../../../graphqlDecorators";

export abstract class PaginatedInputClassAbstract<TItemsFieldValue> {
  public pageIndex: number;

  public pageSize: number;

  public filter?: TItemsFieldValue;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function PaginatedInputFactory<
  TItemsFieldValue extends Record<string, any>,
>(itemsFieldValue: ClassType<TItemsFieldValue>) {
  @GraphqlInputType(`Paginated${itemsFieldValue.name}Input`)
  abstract class PaginatedInputClass extends PaginatedInputClassAbstract<TItemsFieldValue> {
    @GraphqlField(() => Int, {
      nullable: true,
      defaultValue: 0,
      description: "First page has pageIndex value `0`.",
    })
    @IsInt()
    @Min(0)
    public declare pageIndex: number;

    @GraphqlField(() => Int, {
      description: "The maximum number of results per page is `50`.",
      defaultValue: 50,
    })
    @IsInt()
    @Max(50)
    @Min(1)
    public declare pageSize: number;

    @GraphqlField(() => itemsFieldValue, { nullable: true })
    @ValidateNested()
    public declare filter?: TItemsFieldValue;
  }

  return PaginatedInputClass;
}
