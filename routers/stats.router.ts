// npm
import * as Router from 'koa-router';

// services
import { CacheService } from '../services/cache.service';
import { StorageService } from '../services/storage.service';

export class StatsRouter extends Router {
  constructor() {
    super();

    this.get('/stats/', async (ctx) => {
      const cacheService = CacheService.getInstance();
      const storageService = StorageService.getInstance();

      const hits = await cacheService.getHits();
      const misses = await cacheService.getMisses();

      const sourcesCount = storageService.getSourcesFolderCount();
      const cacheCount = storageService.getCacheFolderCount();

      ctx.body = `Stats:
      - Hits: ${ hits }
      - Misses: ${ misses }
      
      - Sources count: ${ sourcesCount } 
      - Cache count: ${ cacheCount }
      `;
    });
  }
}
