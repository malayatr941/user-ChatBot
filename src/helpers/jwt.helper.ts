const jwt = require('jsonwebtoken');
export const jwtHelper = (email: string, company: string) => {
  try {
    return jwt.sign({ email: email, domain: company }, process.env.SECRET_TOKEN, {
      expiresIn: '1d',
    });
  } catch (error) {
    throw error.toString();
  }
};

export const jwtVerify = (token: string | string[]) => {
  try {
    return jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (error) {
    throw error.toString();
  }
};
