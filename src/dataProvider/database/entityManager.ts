import { EntityManager, SqliteDriver } from "@mikro-orm/sqlite";

export class ApiEntityManager extends EntityManager<SqliteDriver> {}
