import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Request, Response } from 'express';
import { Controller } from './interfaces';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(process.env.PORT ? process.env.PORT : 7200, () => {
      console.log(`App listening on the port ${process.env.PORT ? process.env.PORT : 7200}`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeControllers(controllers: Controller[]) {
    this.app.get('/', (req: Request, res: Response) => {
      return res.status(200).json({ status: 'API Service is UP' });
    });
    controllers.forEach((controller) => {
      this.app.use('/chatBot/', controller.router);
    });
  }
}

export default App;
