import { Migration } from "@mikro-orm/migrations";

export class Migration20240313083737 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `pokemon` (`uuid` text not null, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, `height` integer not null, `weight` integer not null, `primary_type` text check (`primary_type` in ('electric', 'water', 'fire')) not null, `secondary_type` text check (`secondary_type` in ('electric', 'water', 'fire')) null, primary key (`uuid`));",
    );
    this.addSql("create index `pokemon_name_index` on `pokemon` (`name`);");
    this.addSql(
      "create unique index `pokemon_name_unique` on `pokemon` (`name`);",
    );

    this.addSql(
      "create table `trainer` (`uuid` text not null, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, `nickname` text null, primary key (`uuid`));",
    );
    this.addSql("create index `trainer_name_index` on `trainer` (`name`);");
    this.addSql(
      "create unique index `trainer_name_unique` on `trainer` (`name`);",
    );

    this.addSql(
      "create table `trainer_pokedex` (`trainer_uuid` text not null, `pokemon_uuid` text not null, constraint `trainer_pokedex_trainer_uuid_foreign` foreign key(`trainer_uuid`) references `trainer`(`uuid`) on delete cascade on update cascade, constraint `trainer_pokedex_pokemon_uuid_foreign` foreign key(`pokemon_uuid`) references `pokemon`(`uuid`) on delete cascade on update cascade, primary key (`trainer_uuid`, `pokemon_uuid`));",
    );
    this.addSql(
      "create index `trainer_pokedex_trainer_uuid_index` on `trainer_pokedex` (`trainer_uuid`);",
    );
    this.addSql(
      "create index `trainer_pokedex_pokemon_uuid_index` on `trainer_pokedex` (`pokemon_uuid`);",
    );
  }
}
