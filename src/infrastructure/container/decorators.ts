import { Container, Service, ServiceOptions, Token } from "typedi";

export class ApiContainer extends Container {}

// eslint-disable-next-line @typescript-eslint/ban-types
export function ApiService(): Function;
// eslint-disable-next-line @typescript-eslint/ban-types
export function ApiService(name: string): Function;
// eslint-disable-next-line @typescript-eslint/ban-types
export function ApiService(token: Token<unknown>): Function;
// eslint-disable-next-line @typescript-eslint/ban-types
export function ApiService<T = unknown>(options?: ServiceOptions<T>): Function;
// eslint-disable-next-line @typescript-eslint/ban-types
export function ApiService(optionsOrNameOrToken?: any): Function {
  return Service(optionsOrNameOrToken);
}
