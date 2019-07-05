// npm
import { agent, SuperTest, Test} from 'supertest';

// services
import { WebService } from '../../services/web.service';

// types
import { IConfig } from '../../config';

// test lib
import { ImageResizeRequest } from './image-resize-request';

export class TestLib {
  public config: IConfig;
  public apiRequester: SuperTest<Test>;
  public imageResize: ImageResizeRequest;

  constructor(config: IConfig) {
    this.config = config;

    const webService = new WebService(this.config.web.imageResize);
    this.apiRequester = agent(webService.app.callback());

    this.imageResize = new ImageResizeRequest(this.apiRequester);
  }
}
