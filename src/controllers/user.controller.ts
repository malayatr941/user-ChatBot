import { Request, Response, Router } from 'express';
const multer = require('multer');
import path = require('path');

import { Controller } from '@interfaces';
import originMiddle from '../middlewares/authentication';
import UserHelper from '../helpers/user.helper';
import { UserValidation } from '../validation';

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, __dirname + '/new');
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

class UserController implements Controller {
  public path = '/user';
  public router = Router({ mergeParams: true });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      upload.single('image'),
      UserValidation.registerValidation,
      this.registerUser,
    );
    this.router.post(`${this.path}/login`, UserValidation.loginValidation, this.loginUser);
    this.router.post(`${this.path}/forget`, this.forgetPassword);
    this.router.post(`${this.path}/newPassword`, UserValidation.newPasswordValidation, this.newPassword);
    this.router.get(`${this.path}/getDetails`, originMiddle.origin, this.getDetails);
    this.router.post(`${this.path}/editProfile`, this.editProfile);
  }

  private registerUser = async (req: Request, res: Response) => {
    await UserHelper.register(res, req.body, req);
  };
  private loginUser = async (req: Request, res: Response) => {
    await UserHelper.login(res, req.body);
  };
  private forgetPassword = async (req: Request, res: Response) => {
    await UserHelper.forgetPassword(res, req.body);
  };
  private newPassword = async (req: Request, res: Response) => {
    await UserHelper.newPassword(res, req.body);
  };
  private getDetails = async (req: Request, res: Response) => {
    await UserHelper.getDetails(res, req.headers['x-auth-token']);
  };
  private editProfile = async (req: Request, res: Response) => {
    await UserHelper.editProfile(res, req.body);
  };
}

export default UserController;
