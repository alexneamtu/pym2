// npm
import * as fs from 'fs';
import * as path from 'path';

// config
import { config } from '../config';

// test lib
import { TestLib } from './lib';

describe('image', () => {
  const lib = new TestLib(config);

  it('should only allow file types specified in the allowed file types enum', async () => {
    const image = lib.image.get('test.doc');
    await expect(image).rejects.toThrow('Error executing query: Invalid file type. Allowed types: jpg,png,gif.');
  });

  it('should return original jpg', async() => {
    const fileName = 'test.jpg';
    const image = await lib.image.get(fileName);
    expect(image).toBeTruthy();
    expect(image.toString()).toEqual(fs.readFileSync(path.join(config.storage.path, fileName)).toString());
  });

  it('should return original gif', async() => {
    const fileName = 'test.gif';
    const image = await lib.image.get(fileName);
    expect(image).toBeTruthy();
    expect(image.toString()).toEqual(fs.readFileSync(path.join(config.storage.path, fileName)).toString());
  });

  it('should return original png', async() => {
    const fileName = 'test.png';
    const image = await lib.image.get(fileName);
    expect(image).toBeTruthy();
    expect(image.toString()).toEqual(fs.readFileSync(path.join(config.storage.path, fileName)).toString());
  });
});
