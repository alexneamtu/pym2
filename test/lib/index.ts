// npm
import { agent } from 'supertest';

// types
import { IConfig } from '../../config';

// routers
import { ImageRouter } from '../../routers/image.router';

// services
import { CacheService } from '../../services/cache.service';
import { StorageService } from '../../services/storage.service';
import { WebService } from '../../services/web.service';

// test lib
import { ImageRequest } from './image-request';

export class TestLib {
  public config: IConfig;
  public apiRequester: ReturnType<typeof agent>;
  public image: ImageRequest;
  public storageService: StorageService;
  public cacheService: CacheService;

  constructor(config: IConfig) {
    this.config = config;

    this.storageService = StorageService.getInstance();
    this.cacheService = CacheService.getInstance();

    const imageWebService = new WebService('image', this.config.web.image, new ImageRouter());
    this.apiRequester = agent(imageWebService.app.callback());

    this.image = new ImageRequest(this.apiRequester);
  }

  public async setup() {
    this.storageService.initialize();
    this.cacheService.initialize();
    this.storageService.cleanup();
    await this.cacheService.cleanup();
  }
}
