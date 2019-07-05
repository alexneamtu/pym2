// npm
import * as Router from 'koa-router';
import * as _ from 'lodash';
import { lookup as mimeTypeLookup } from 'mime-types';

// enums
import { AllowedFileTypes } from '../enums';

// services
import { ISizeInput } from '../services/image-resize.service';
import { StorageService } from '../services/storage.service';

export class ImageRouter extends Router {
  private static processInputFile(file: string): string {
    const mimeType = mimeTypeLookup(file);
    if (!_.includes(_.values(AllowedFileTypes), mimeType)) {
      throw new Error(`Invalid file type. Allowed types: ${ _.join(_.keys(AllowedFileTypes)) }.`);
    }
    return mimeType as string;
  }

  private static processInputSize(size: string): ISizeInput {
    const sizeRegex = /(?<width>\d+)x(?<height>\d+)/u;
    const sizeRegexResult = sizeRegex.exec(size);

    if (!sizeRegexResult) return null;

    const width = _.parseInt(sizeRegexResult.groups.width);
    const height = _.parseInt(sizeRegexResult.groups.height);
    return { width, height };
  }

  constructor() {
    super();

    this.get('/image/:file', async (ctx) => {
      const fileInput = _.get(ctx, 'params.file');
      const sizeInput = _.get(ctx, 'request.query.size');

      const fileMimeType = ImageRouter.processInputFile(fileInput);
      const size = ImageRouter.processInputSize(sizeInput);

      const storageService = StorageService.getInstance();

      const fileContent = size ?
        await storageService.getReSizedFileContent(fileInput, size) :
        await storageService.getSourceFileContent(fileInput);
      ctx.set('Content-Type', fileMimeType);
      ctx.body = fileContent;
    });
  }
}
