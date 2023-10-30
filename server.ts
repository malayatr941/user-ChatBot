import * as config from './config';
import { connect } from './src/connection';
import UserController from './src/controllers/user.controller';

(async () => {
  await config.initiate();
})();
import App from './src/app';

const app = new App([new UserController()]);

connect();

app.listen();
