import * as config from '../config';
import {connect} from './connection';
import UserController from './controllers/user.controller';

(async () => {
   await config.initiate();
})();
import App from './app';

const app = new App([new UserController()]);

connect();

app.listen();
