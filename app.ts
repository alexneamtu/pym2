// services
import { WebService } from './services/web.service';

// config
import { config } from './config';

const imageResizeWebService = new WebService(config.web.imageResize);

async function initialize() {
  await imageResizeWebService.listen();
}

void initialize();
