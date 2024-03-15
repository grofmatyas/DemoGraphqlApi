This is Demo Graphql API

Warning! This is work in progress. Some features may be missing and same todos may exist. Also some bugs. 

Decisions:
- yarn - why not :)
- no default imports - easier to refactor names
- CommonJS vs ESM - CommonJS on backend node.js application - Synchronous Loading + Node.js Compatibility
- DB - SQLite for simplicity - MikroORM because it is just the best
- Logs - Debugr - it is my work so it is made for my liking
- Type-Graphql + Typedi + MikroOrm decorators - made abstraction so that it is not imported in nearly every file

- TODO: Call as Transaction
- TODO: Tests - ?Mocha+Chai or Vitest or some other framework? + CICD for future tests
- TODO: Apollo 4
- TODO: Fastify instead od express - why not as .env switcher?

Structure:
- Connector
- DataProvider
- Entity
- Entrypoint
- Infrastructure
- Migrations
- Service
- Testing
- Utils
