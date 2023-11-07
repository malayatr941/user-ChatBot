import User from '../models/User';
import { ESResponse, Login, IUser, ForgetPassword, NewPassword, EditProfile } from '@interfaces';
import { Response } from 'express';
import responseHelper from '../responses/response.helper';
//import Redis from './redis.helper';
import { jwtHelper, jwtVerify } from './jwt.helper';

class UserHelper {
  public data: ESResponse;

  register = async (res: Response, payload: IUser, file: any) => {
    try {
      const isUser = await this.userExist(payload.email);
      if (isUser) {
        throw 'User already exists';
      }
      const token = jwtHelper(payload.email, payload.company);
      payload.token = token;
      payload.avatar = file.file.originalname;
      const newUser = new User(payload);
      const userDetails = await newUser.save();
      // await Redis.client.lPush(`${user._id}`, token);
      // const length = await Redis.client.lLen(`${user._id}`);
      // if (length > 1) {
      //   Redis.client.rPop(`${user._id}`);
      // }
      const data = {
        error: false,
        data: userDetails,
        message: 'User created successfully',
        status: 200,
      };
      responseHelper.success(res, data);
    } catch (error) {
      const data = {
        error: true,
        data: {},
        message: error.toString(),
        status: 500,
      };
      responseHelper.error(res, data);
    }
  };

  login = async (res: Response, payload: Login) => {
    try {
      const isUser: IUser = await this.userExist(payload.email);
      if (isUser) {
        const passwordMatch: boolean = payload.password === isUser.password;
        if (passwordMatch) {
          const token = jwtHelper(isUser.email, isUser.company);
          await User.updateOne(
            { email: isUser.email },
            {
              $set: {
                token: token,
              },
            },
          );
          isUser.token = token;
          const data = {
            error: false,
            data: isUser,
            message: 'User logged in successfully',
            status: 200,
          };

          responseHelper.success(res, data);
        } else {
          throw { message: 'Wrong password', status: 404 };
        }
      } else {
        throw 'User does not exist';
      }
    } catch (error) {
      const data = {
        error: true,
        data: {},
        message: error.message ? error.message : error.toString(),
        status: 500,
      };
      responseHelper.error(res, data);
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
        const data = {
          error: false,
          data: { token: token },
          message: 'User exist',
          status: 200,
        };
        responseHelper.success(res, data);
      } else {
        throw 'User does not exist';
      }
    } catch (error) {
      const data = {
        error: true,
        data: {},
        message: error.toString(),
        status: 500,
      };
      responseHelper.error(res, data);
    }
  };

  newPassword = async (res: Response, payload: NewPassword) => {
    try {
      const verify = jwtVerify(payload.token);

      if (verify) {
        const updateResult = await User.updateOne(
          { email: verify.email },
          {
            $set: {
              password: payload.password,
            },
          },
        );
        if (updateResult.modifiedCount > 0) {
          const data = {
            error: false,
            data: updateResult,
            message: 'Password changed successfully',
            status: 200,
          };
          responseHelper.success(res, data);
        } else {
          throw 'You can not use password same as previous one.';
        }
      } else {
        throw 'User does not exist';
      }
    } catch (error) {
      const data = {
        error: true,
        data: {},
        message: error.toString(),
        status: 500,
      };
      responseHelper.error(res, data);
    }
  };

  getDetails = async (res: Response, token: string | string[]) => {
    try {
      const decodedToken = jwtVerify(token);
      const user = await User.findOne({ email: decodedToken.email }).select('-password');

      if (user) {
        const data = {
          error: false,
          data: user,
          message: 'Details fetched successfully',
          status: 200,
        };
        responseHelper.success(res, data);
      } else {
        throw { message: 'No details found' };
      }
    } catch (error) {
      responseHelper.error(res, error.toString());
    }
  };
  editProfile = async (res: Response, payload: EditProfile) => {
    try {
      const isUser: IUser = await this.userExist(payload.email);
      const passwordsMatch: boolean = payload.password === isUser.password;

      if (passwordsMatch) {
        if (payload.newPassword) {
          payload.password = payload.newPassword;
        }
        const updateResult = await User.updateOne({ email: isUser.email }, { $set: payload });
        const responseData = {
          error: false,
          data: updateResult,
          message: 'Profile updated successfully',
          status: 200,
        };

        responseHelper.success(res, responseData);
      } else {
        throw new Error('Incorrect Password');
      }
    } catch (error) {
      const data = {
        error: true,
        data: {},
        message: error.toString(),
        status: 500,
      };
      responseHelper.error(res, data);
    }
  };
}

export default new UserHelper();
