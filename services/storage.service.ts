// npm
import * as fs from 'fs';
import * as path from 'path';

// config
import { config } from '../config';

// service
import { ImageResizeService, ISizeInput } from './image-resize.service';

export class StorageService {
  public static getInstance(): StorageService {
    return this.instance || (this.instance = new this());
  }

  private static instance: StorageService;
  private sourcesPath: string;
  private cachePath: string;

  private constructor() {}

  public initialize() {
    const sourcesPath = config.storage.sourcesPath;
    const cachePath = config.storage.sourcesPath;

    if (!fs.existsSync(sourcesPath)) throw new Error('Missing sources path.');
    if (!fs.existsSync(cachePath)) throw new Error('Missing cache path.');

    try {
      this.sourcesPath = path.resolve(sourcesPath);
      this.cachePath = path.resolve(cachePath);
    } catch (error) {
      throw new Error(`Storage service config error: ${error.message}` );
    }
  }

  public getSourceFileContent(fileName: string) {
    const resolvedPath = path.resolve(this.sourcesPath, fileName);
    return fs.readFileSync(resolvedPath);
  }

  public getCacheFileContent(fileName: string, size: ISizeInput) {
    const cachedFileName = StorageService.getCachedFileName(fileName, size);
    const resolvedPath = path.resolve(this.cachePath, cachedFileName);
    try {
      return fs.readFileSync(resolvedPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw new Error(error.message);
      return false;
    }
  }

  private static getCachedFileName(fileName: string, size: ISizeInput) {
    const parsedFileName = path.parse(fileName);
    return `${parsedFileName.name}.${size.width}x${size.height}${parsedFileName.ext}`;
  }

  public async getReSizedFileContent(fileName: string, size: ISizeInput) {
    const reSizedFile = this.getCacheFileContent(fileName, size);
    if (!reSizedFile) {
      try {
        await ImageResizeService.resize(
          path.resolve(this.sourcesPath, fileName),
          path.resolve(this.cachePath, StorageService.getCachedFileName(fileName, size)),
          size,
        );
      } catch (error) {
        throw new Error('Failed to generate resize.');
      }
    }
    return this.getCacheFileContent(fileName, size);
  }
}
