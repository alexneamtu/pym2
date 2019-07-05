// npm
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Server } from 'http';

interface IWebServiceConfig {
  port: number;
}

export class WebService {
  public readonly app: Koa;
  public server: Server;

  private static async errorHandler(ctx: Koa.Context, next: Function) {
    try {
      await next();
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = error.message;
      ctx.app.emit('error', error, ctx);
    }
  }

  constructor(private name: string, private config: IWebServiceConfig, router: KoaRouter) {
    const app = new Koa();

    app.use(WebService.errorHandler);

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.on('error', function(err) {
      console.error(`Application error: ${err}`, err);
    });

    this.app = app;
  }

  public async listen() {
    this.server = this.app.listen(this.config.port, () => {
      console.info(`${this.name} server listening on port ${this.config.port}...`);
    });
  }
}
