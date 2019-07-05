// config
import { config } from '../config';

// test lib
import { TestLib } from './lib';

describe('image-resize', () => {
  const lib = new TestLib(config);

  it('should only allow file types specified in the allowed file types enum', async () => {
    const resize = lib.imageResize.resize('test');
    await expect(resize).rejects.toThrow('Error executing query: Invalid file type. Allowed types: jpg,png,gif.');
  });
});
