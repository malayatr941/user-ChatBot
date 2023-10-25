import * as Joi from 'joi';
import * as express from 'express';

export const registerValidation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    company: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(401).send(error.toString());
  }
  next();
};

export const loginValidation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const schema = Joi.object({
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(401).send(error.toString());
  }
  next();
};