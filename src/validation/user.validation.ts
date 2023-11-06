import * as Joi from 'joi';
import * as express from 'express';

export const registerValidation = (req: any, res: express.Response, next: express.NextFunction) => {
  // const schema = Joi.object({
  //   name: Joi.string().min(3).required(),
  //   password: Joi.string().min(8).required(),
  //   email: Joi.string().email().required(),
  //   company: Joi.string().required(),
  // });
  const schema2 = Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string(),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
    size: Joi.number(),
  });
  const { error } = schema2.validate(req.file, req.body);
  //const { error } = schema.validate(req.body.user);
  if (error) {
    return res.status(401).send(error.toString());
  }
  next();
};

export const loginValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const schema = Joi.object({
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(401).send(error.toString());
  }
  next();
};
export const newPasswordValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const schema = Joi.object({
    password: Joi.string().min(8).required(),
    token: Joi.string(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(401).send(error.toString());
  }
  next();
};
export const editProfileValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    company: Joi.string().required(),
    avatar: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(401).send(error.toString());
  }
  next();
};
