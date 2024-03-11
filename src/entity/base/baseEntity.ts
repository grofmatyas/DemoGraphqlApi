import { v4 } from "uuid";

import { OrmPrimaryKey, OrmProperty } from "../ormDecorators";

export abstract class ApiBaseEntity {
  @OrmPrimaryKey()
  uuid = v4();

  @OrmProperty()
  createdAt = new Date();

  @OrmProperty({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
