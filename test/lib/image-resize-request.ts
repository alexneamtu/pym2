// npm
import { Response, SuperTest, Test } from 'supertest';

export class ImageResizeRequest {
  constructor(protected requester: SuperTest<Test>) {}

  public async resize(file: string): Promise<string> {
    const response: Response = await this.requester.get(`/image/${file}`);

    if (response.error) {
      throw new Error(`Error executing query: ${response.text}`);
    }

    return response.text;
  }
}
