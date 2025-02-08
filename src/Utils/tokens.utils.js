  import jwt from 'jsonwebtoken';

  export const verifyToken = ({ token, secretKey }) => {
    return jwt.verify(token, secretKey);
  };

  export const createToken = ({ payload, secretKey, options }) => {
    return jwt.sign(payload, secretKey, options);
};