// services
import { StorageService } from './services/storage.service';
import { WebService } from './services/web.service';

// config
import { config } from './config';

const storageService = StorageService.getInstance();
const imageWebService = new WebService(config.web.image);

async function initialize() {
  storageService.initialize();
  await imageWebService.listen();
}

void initialize();
