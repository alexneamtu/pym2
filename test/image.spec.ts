// npm
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

// config
import { config } from '../config';

// test lib
import { TestLib } from './lib';

describe('image', () => {
  const lib = new TestLib(config);

  beforeAll(async () => {
    await lib.setup();
  });

  it('should only allow file types specified in the allowed file types enum', async () => {
    const image = lib.image.get('test.doc');
    await expect(image).rejects.toThrow('Error executing query: Invalid file type. Allowed types: jpg,png,gif.');
  });

  it('should return original jpg', async() => {
    const queryString = 'test.jpg';
    const image = await lib.image.get(queryString);
    expect(image).toBeTruthy();
    expect(image.toString()).toEqual(fs.readFileSync(path.join(config.storage.sourcesPath, queryString)).toString());
  });

  it('should return original gif', async() => {
    const queryString = 'test.gif';
    const image = await lib.image.get(queryString);
    expect(image).toBeTruthy();
    expect(image.toString()).toEqual(fs.readFileSync(path.join(config.storage.sourcesPath, queryString)).toString());
  });

  it('should return original png', async() => {
    const queryString = 'test.png';
    const image = await lib.image.get(queryString);
    expect(image).toBeTruthy();
    expect(image.toString()).toEqual(fs.readFileSync(path.join(config.storage.sourcesPath, queryString)).toString());
  });

  it('should return resized jpg', async() => {
    const image = await lib.image.get('test.jpg?size=200x200');
    expect(image).toBeTruthy();
    const cachedImagePath = path.join(config.storage.cachePath, 'test.200x200.jpg');
    expect(fs.existsSync(cachedImagePath)).toBeTruthy();
    const imageMetadata = await sharp(image).metadata();
    expect(imageMetadata.width).toEqual(200);
    expect(imageMetadata.height).toEqual(200);
  });

  it('should return resized gif', async() => {
    const image = await lib.image.get('test.gif?size=200x200');
    expect(image).toBeTruthy();
    const cachedImagePath = path.join(config.storage.cachePath, 'test.200x200.gif');
    expect(fs.existsSync(cachedImagePath)).toBeTruthy();
    const imageMetadata = await sharp(image).metadata();
    expect(imageMetadata.width).toEqual(200);
    expect(imageMetadata.height).toEqual(200);
  });

  it('should return resized png', async() => {
    const image = await lib.image.get('test.png?size=200x200');
    expect(image).toBeTruthy();
    const cachedImagePath = path.join(config.storage.cachePath, 'test.200x200.png');
    expect(fs.existsSync(cachedImagePath)).toBeTruthy();
    const imageMetadata = await sharp(image).metadata();
    expect(imageMetadata.width).toEqual(200);
    expect(imageMetadata.height).toEqual(200);
  });
});
