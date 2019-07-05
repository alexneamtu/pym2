// npm
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

// config
import { config } from '../config';

// enums
import { AllowedFileTypes } from '../enums';

// service
import { CacheService } from './cache.service';
import { ImageResizeService, ISizeInput } from './image-resize.service';
import { lookup as mimeTypeLookup } from 'mime-types';

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
    const cachePath = config.storage.cachePath;

    if (!fs.existsSync(sourcesPath)) throw new Error('Missing sources path.');
    if (!fs.existsSync(cachePath)) throw new Error('Missing cache path.');

    try {
      this.sourcesPath = path.resolve(sourcesPath);
      this.cachePath = path.resolve(cachePath);
    } catch (error) {
      throw new Error(`Storage service config error: ${error.message}` );
    }
  }

  public async getSourceFileContent(fileName: string) {
    try {
      const resolvedPath = path.resolve(this.sourcesPath, fileName);
      return fs.readFileSync(resolvedPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw new Error(error.message);
    }
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
    if (reSizedFile) {
      await CacheService.getInstance().incrementHits();
    } else {
      await CacheService.getInstance().incrementMisses();
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

  public getSourcesFolderCount(): number {
    return this.getFolderCount(this.sourcesPath);
  }

  public getCacheFolderCount(): number {
    return this.getFolderCount(this.cachePath);
  }

  private getFolderCount(path: string): number {
    const images = _.filter(fs.readdirSync(path), (file) => {
      const mimeType = mimeTypeLookup(file);
      return _.includes(_.values(AllowedFileTypes), mimeType);
    });
    return images.length;
  }
}
