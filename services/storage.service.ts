// npm
import * as fs from 'fs';
import * as path from 'path';

// config
import { config } from '../config';

export interface IStorageServiceConfig {
  path: string;
}

export class StorageService {
  public static getInstance(): StorageService {
    return this.instance || (this.instance = new this());
  }

  private static instance: StorageService;
  private storagePath: string;

  private constructor() {}

  public initialize() {
    try {
      this.storagePath = path.resolve(config.storage.path);
    } catch (e) {
      throw new Error(`Storage service config error: ${e.message}` );
    }
  }


  public getFileContent(fileName: string) {
    try {
      const resolvedPath = path.resolve(this.storagePath, fileName);
      return fs.readFileSync(resolvedPath);
    } catch (e) {
      console.log(e);
    }

  }
}
