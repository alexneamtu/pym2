// npm
import { Context } from 'koa';
import * as Router from 'koa-router';
import * as _ from 'lodash';
import { lookup as mimeTypeLookup } from 'mime-types';

// enums
import { AllowedFileTypes } from '../enums';

export class ImageResizeRouter extends Router {
  constructor() {
    super();

    this.get('/image/:file', async (ctx) => {
      ImageResizeRouter.validateInput(ctx.params);

      ctx.body = 'test';
    });
  }

  private static validateInputFile(file: string): void {
    const mimeType = mimeTypeLookup(file);
    if (!_.includes(_.values(AllowedFileTypes), mimeType)) {
      throw new Error(`Invalid file type. Allowed types: ${ _.join(_.keys(AllowedFileTypes)) }.`)
    }
  }

  private static validateInput(ctx: Context): void {
    ImageResizeRouter.validateInputFile(ctx.file);
  }
}
