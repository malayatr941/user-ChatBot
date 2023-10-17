import { Controller } from "@interfaces";
import { Request,Response,Router } from "express";
import UserHelper from "../helpers/user.helper";
import { registerValidation,loginValidation } from "../validation";

class UserController implements Controller {
   public path = '/user';
   public router = Router({mergeParams: true});

   constructor() {
    this.initializeRoutes();
   }

   private initializeRoutes(){
    this.router.post(`${this.path}/register`, registerValidation,
     this.registerUser
    );
    this.router.post(`${this.path}/login`, loginValidation,
    this.loginUser)

   }

   private registerUser = async (req:Request, res:Response) => {
      await UserHelper.register(res,req.body);
   }
   private loginUser = async (req:Request, res:Response) => {
      await UserHelper.login(res,req.body);
   }
}

export default UserController;