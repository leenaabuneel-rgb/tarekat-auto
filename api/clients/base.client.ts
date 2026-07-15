import { APIRequestContext } from '@playwright/test';

export class BaseApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseURL: string,
  ) {}
}
