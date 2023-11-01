import User from '../models/User';
import { ESResponse, Login, IUser, ForgetPassword, NewPassword, EditProfile } from '@interfaces';
import { Response } from 'express';
import responseHelper from '../responses/response.helper';
import Redis from './redis.helper';
import { jwtHelper, jwtVerify } from './jwt.helper';

class UserHelper {
  public data: ESResponse;

  register = async (res: Response, payload: IUser) => {
    try {
      const isUser = await this.userExist(payload.email);
      if (isUser) {
        throw 'User already exists';
      }
      const token = jwtHelper(payload.email, payload.company);
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
          const token = jwtHelper(isUser.email, isUser.company);
          await User.updateOne(
            { email: isUser.email },
            {
              $set: {
                token: token,
              },
            },
          )
            .then(() => {
              isUser.token = token;
              this.data = {
                error: false,
                data: isUser,
                message: 'User logged in successfully',
                status: 200,
              };
            })
            .catch((err) => {
              throw err.toString();
            });
          responseHelper.success(res, this.data);
        } else {
          throw { message: 'Wrong Password', status: 404 };
        }
      } else {
        throw 'User not Exist';
      }
    } catch (error) {
      this.data = {
        error: true,
        data: {},
        message: error.message ? error.message : error.toString(),
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
        const token = jwtHelper(payload.email, isUser.company);
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
      const verify = jwtVerify(payload.token);
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
              message: 'Password changed successfully',
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
  getDetails = async (res: Response, token: string | string[]) => {
    const decode = jwtVerify(token);
    await User.findOne({ email: decode.email })
      .select('-password')
      .then((res) => {
        if (res) {
          this.data = {
            error: false,
            data: res,
            message: 'Details fetched successfully',
            status: 200,
          };
        } else {
          throw { message: 'No details found' };
        }
      })
      .catch((err) => {
        throw err.toString();
      });
    responseHelper.success(res, this.data);
  };
  editProfile = async (res: Response, payload: EditProfile) => {
    try {
      const isUser: IUser = await this.userExist(payload.email);
      const result: boolean = payload.password == isUser.password;
      if (result) {
        await User.updateOne({ email: isUser.email }, { $set: payload })
          .then((res) => {
            this.data = {
              error: false,
              data: res,
              message: 'Profile updated successfully',
              status: 200,
            };
          })
          .catch((err) => {
            throw err.toString();
          });
        responseHelper.success(res, this.data);
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
