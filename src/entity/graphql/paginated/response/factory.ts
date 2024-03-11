import {
  ClassType,
  GraphqlEntity,
  GraphqlField,
  Int,
} from "../../../graphqlDecorators";

export abstract class PaginatedResponseClassAbstract<TEntries> {
  public entriesTotalCount: number;

  public pageCount: number;

  public currentPageIndex: number;

  public pageSize: number;

  public entries: TEntries[];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function PaginatedResponseFactory<TEntries extends object>(
  itemsFieldValue: ClassType<TEntries>,
) {
  @GraphqlEntity(`Paginated${itemsFieldValue.name}Response`)
  abstract class PaginatedResponseClass extends PaginatedResponseClassAbstract<TEntries> {
    @GraphqlField(() => Int)
    public declare entriesTotalCount: number;

    @GraphqlField(() => Int)
    public declare pageCount: number;

    @GraphqlField(() => Int)
    public declare currentPageIndex: number;

    @GraphqlField(() => Int)
    public declare pageSize: number;

    @GraphqlField(() => [itemsFieldValue])
    public declare entries: TEntries[];
  }

  return PaginatedResponseClass;
}
