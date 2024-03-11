import { MikroORM, EntityManager, SqliteDriver } from "@mikro-orm/sqlite";

export class DatabaseConnection extends MikroORM<EntityManager<SqliteDriver>> {}
