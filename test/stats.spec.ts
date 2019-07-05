// config
import { config } from '../config';

// test lib
import { TestLib } from './lib';

// services
import { CacheService } from '../services/cache.service';

describe('stats', () => {
  const lib = new TestLib(config);

  it('should increment misses', async() => {
    const cacheService = CacheService.getInstance();

    const initialMisses = await cacheService.getMisses();
    const initialHits = await cacheService.getHits();

    const queryString = 'test.jpg?size=200x200';
    const image = await lib.image.get(queryString);
    expect(image).toBeTruthy();

    const currentMisses = await cacheService.getMisses();
    const currentHits = await cacheService.getHits();

    expect(currentMisses).toEqual(initialMisses + 1);
    expect(currentHits).toEqual(initialHits);
  });

  it('should increment hits', async() => {
    const cacheService = CacheService.getInstance();

    const queryString = 'test.png?size=200x200';
    const image1 = await lib.image.get(queryString);
    expect(image1).toBeTruthy();

    const initialMisses = await cacheService.getMisses();
    const initialHits = await cacheService.getHits();

    const image2 = await lib.image.get(queryString);
    expect(image2).toBeTruthy();

    const currentMisses = await cacheService.getMisses();
    const currentHits = await cacheService.getHits();

    expect(currentHits).toEqual(initialHits + 1);
    expect(currentMisses).toEqual(initialMisses);
  });
});
