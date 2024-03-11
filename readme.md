This is Demo Graphql API


Decisions:
- no default imports - easier to refactor names
- CommonJS vs ESM - CommonJS on backend node.js application - Synchronous Loading + Node.js Compatibility
- DB - SQLite for simplicity - MikroORM because it is just the best
- Logs - Debugr - it is my work so it is made for my liking
- Node.js -v < 20.0.0 - compatibility with ts-node - I do not like that decision
- Type-Graphql + Typedi + MikroOrm decorators - made abstraction so that it is not imported in nearly every file

- TODO: Call as Transaction
- TODO: Tests - ?Mocha+Chai or Vitest or some other framework?

Structure:
- Connector
- DataProvider
- Entity
- Entrypoint
- Infrastructure
- Migrations
- Service
- Utils
