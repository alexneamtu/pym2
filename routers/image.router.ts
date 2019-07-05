// npm
import { Context } from 'koa';
import * as Router from 'koa-router';
import * as _ from 'lodash';
import { lookup as mimeTypeLookup } from 'mime-types';

// enums
import { AllowedFileTypes } from '../enums';

// services
import { StorageService } from '../services/storage.service';

export class ImageRouter extends Router {
  constructor() {
    super();

    this.get('/image/:file', async (ctx) => {
      ImageRouter.validateInput(ctx);

      const file = ctx.params.file;
      const fileMimeType = mimeTypeLookup(file) || 'text/plain';

      const storageService = StorageService.getInstance();
      ctx.set('Content-Type', fileMimeType);
      ctx.body = storageService.getFileContent(file);
    });
  }

  private static validateInputFile(file: string): void {
    const mimeType = mimeTypeLookup(file);
    if (!_.includes(_.values(AllowedFileTypes), mimeType)) {
      throw new Error(`Invalid file type. Allowed types: ${ _.join(_.keys(AllowedFileTypes)) }.`)
    }
  }

  private static validateInput(ctx: Context): void {
    ImageRouter.validateInputFile(ctx.params.file);
  }
}
