// npm
import * as Koa from 'koa';
import { Server } from "http";

// routers
import { ImageRouter } from '../routers/image.router';
import { Context } from 'koa';

interface IWebServiceConfig {
  port: number;
}

export class WebService {
  public readonly app: Koa;
  public server: Server;

  private static async errorHandler(ctx: Context, next: Function) {
    try {
      await next();
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = error.message;
      ctx.app.emit('error', error, ctx);
    }
  }

  constructor(private config: IWebServiceConfig) {
    const app = new Koa();

    app.use(WebService.errorHandler);

    const router = new ImageRouter();

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.on('error', function(err) {
      console.error(`Application error: ${err}`, err);
    });

    this.app = app;
  }

  public async listen() {
    this.server = this.app.listen(this.config.port, () => {
      console.info(`Listening on port ${this.config.port}...`);
    });
  }
}
