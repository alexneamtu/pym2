// npm
import { agent, SuperTest, Test} from 'supertest';

// types
import { IConfig } from '../../config';

// test lib
import { ImageRequest } from './image-request';

// services
import { StorageService } from '../../services/storage.service';
import { WebService } from '../../services/web.service';

export class TestLib {
  public config: IConfig;
  public apiRequester: SuperTest<Test>;
  public image: ImageRequest;

  constructor(config: IConfig) {
    this.config = config;

    StorageService.getInstance().initialize();

    const webService = new WebService(this.config.web.image);
    this.apiRequester = agent(webService.app.callback());

    this.image = new ImageRequest(this.apiRequester);
  }
}
