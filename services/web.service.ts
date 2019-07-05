// npm
import { Server } from 'http';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

interface IWebServiceConfig {
  port: number;
}

export class WebService {
  private static async errorHandler(ctx: Koa.Context, next: () => void) {
    try {
      await next();
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = error.message;
      ctx.app.emit('error', error, ctx);
    }
  }

  public readonly app: Koa;
  public server: Server;

  constructor(private name: string, private config: IWebServiceConfig, router: KoaRouter) {
    const app = new Koa();

    app.use(WebService.errorHandler);

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.on('error', (err) => {
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
