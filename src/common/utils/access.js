import jwt from 'jsonwebtoken';
import { secret } from '@Config/api';

export const createToken = (sign, expiresIn = 86400) => jwt.sign(
  sign,
  secret,
  {
    expiresIn,
  },
);

export const verifyToken = (token, callback) => jwt.verify(token, secret, callback);
