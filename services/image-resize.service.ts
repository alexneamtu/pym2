// npm
import * as sharp from 'sharp';

export interface ISizeInput {
  width: number;
  height: number;
}

export class ImageResizeService {
  public static async resize(
    source: string,
    destination: string,
    size: ISizeInput,
  ): Promise<sharp.OutputInfo> {
    return sharp(source).resize(size.width, size.height).toFile(destination);
  }

}
