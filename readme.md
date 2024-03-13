This is Demo Graphql API

Warning! This is work in progress. Some features may be missing and same todos may be redundant

Decisions:
- no default imports - easier to refactor names
- CommonJS vs ESM - CommonJS on backend node.js application - Synchronous Loading + Node.js Compatibility
- DB - SQLite for simplicity - MikroORM because it is just the best
- Logs - Debugr - it is my work so it is made for my liking
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
