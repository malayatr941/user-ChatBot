import User from '../models/User';
import { ESResponse, Login, IUser, ForgetPassword, NewPassword } from '@interfaces';
import { Response } from 'express';
import responseHelper from '../responses/response.helper';
const jwt = require('jsonwebtoken');
import Redis from './redis.helper';

class UserHelper {
  public data: ESResponse;

  register = async (res: Response, payload: IUser) => {
    try {
      const isUser = await this.userExist(payload.email);
      if (isUser) {
        throw 'User already exists';
      }
      const token = jwt.sign({ email: payload.email, domain: payload.company }, process.env.SECRET_TOKEN, {
        expiresIn: '1d',
      });
      payload.token = token;
      const newUser = new User(payload);

      await newUser.save().then(async (user) => {
        await Redis.client.lPush(`${user._id}`, token);
        const length = await Redis.client.lLen(`${user._id}`);
        if (length > 1) {
          Redis.client.rPop(`${user._id}`);
        }
        this.data = {
          error: false,
          data: user,
          message: 'User created successfully',
          status: 200,
        };
        responseHelper.success(res, this.data);
      });
    } catch (error) {
      this.data = {
        error: true,
        data: {},
        message: error.toString(),
        status: 500,
      };
      responseHelper.error(res, this.data);
    }
  };

  login = async (res: Response, payload: Login) => {
    try {
      const isUser: IUser = await this.userExist(payload.email);
      if (isUser) {
        const result: boolean = payload.password == isUser.password;
        if (result) {
          this.data = {
            error: false,
            data: isUser,
            message: 'User logged in successfull',
            status: 200,
          };
          responseHelper.success(res, this.data);
        } else {
          throw 'Wrong password';
        }
      } else {
        throw 'User not exist';
      }
    } catch (error) {
      this.data = {
        error: true,
        data: {},
        message: error.toString(),
        status: 500,
      };
      responseHelper.error(res, this.data);
    }
  };

  userExist = async (email: string): Promise<IUser> => {
    return new Promise((resolve, reject) => {
      User.findOne({
        email: email,
      })
        .then((res: IUser) => {
          if (res) {
            resolve(res);
          } else {
            resolve(null);
          }
        })
        .catch((err) => reject(err));
    });
  };

  forgetPassword = async (res: Response, payload: ForgetPassword) => {
    try {
      const isUser: IUser = await this.userExist(payload.email);
      if (isUser) {
        const token = jwt.sign({ email: payload.email }, process.env.SECRET_TOKEN, {
          expiresIn: '5m',
        });
        this.data = {
          error: false,
          data: { token: token },
          message: 'User Exist',
          status: 200,
        };
        responseHelper.success(res, this.data);
      } else {
        throw 'User not exist';
      }
    } catch (error) {
      this.data = {
        error: true,
        data: {},
        message: error.toString(),
        status: 500,
      };
      responseHelper.error(res, this.data);
    }
  };

  newPassword = async (res: Response, payload: NewPassword) => {
    try {
      const verify = jwt.verify(payload.token, process.env.SECRET_TOKEN);
      if (verify) {
        await User.updateOne(
          { email: verify.email },
          {
            $set: {
              password: payload.password,
            },
          },
        )
          .then((res) => {
            this.data = {
              error: false,
              data: res,
              message: 'Password Changed Successfully',
              status: 200,
            };
          })
          .catch((err) => {
            throw err.toString();
          });
        responseHelper.success(res, this.data);
      } else {
        throw 'User not exist';
      }
    } catch (error) {
      this.data = {
        error: true,
        data: {},
        message: error.toString(),
        status: 500,
      };
      responseHelper.error(res, this.data);
    }
  };
}

export default new UserHelper();
