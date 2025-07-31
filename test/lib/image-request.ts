// npm
import { Response } from 'supertest';

export class ImageRequest {
  constructor(protected requester: ReturnType<typeof import('supertest').agent>) {
  }

  public async get(queryString: string): Promise<string> {
    const response: Response = await this.requester.get(`/image/${queryString}`);

    if (response.error) {
      throw new Error(`Error executing query: ${response.text}`);
    }

    return response.body;
  }
}
