// config
import { config } from './config';

// routers
import { ImageRouter } from './routers/image.router';
import { StatsRouter } from './routers/stats.router';

// services
import { CacheService } from './services/cache.service';
import { StorageService } from './services/storage.service';
import { WebService } from './services/web.service';

const cacheService = CacheService.getInstance();
const storageService = StorageService.getInstance();
const imageWebService = new WebService('image', config.web.image, new ImageRouter());
const statsWebService = new WebService('stats', config.web.stats, new StatsRouter());

async function initialize() {
  cacheService.initialize();
  storageService.initialize();
  await imageWebService.listen();
  await statsWebService.listen();
}

void initialize();
