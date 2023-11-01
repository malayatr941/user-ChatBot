const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';
import responseHelper from '../responses/response.helper';
import { ESResponse, ESdomain } from '@interfaces';
class originMiddle {
  public data: ESResponse;

  origin = (req: Request, res: Response, next: NextFunction) => {
    const domain = req.socket.remoteAddress;
    const token = req.headers['x-auth-token'];
    try {
      jwt.verify(token, process.env.SECRET_TOKEN, (err: Error, user: ESdomain) => {
        if (err) {
          throw 'Invalid token, authorization failed';
        }
        let result = true;
        result = user.domain == domain || domain == '::1';
        if (!result) {
          throw 'Domain not registered';
        }
        return next();
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
}

export default new originMiddle();
