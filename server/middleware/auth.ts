import { RequestHandler } from 'express';
import {repository} from '../repositories'

const authMiddleware: RequestHandler = (
  {headers: {accesstoken, refreshtoken}},
  res,
  next,
) => {
  // console.log('CCESSS', req.headers)
  const validateToken = repository.validateToken(accesstoken as string, refreshtoken as string)
};

export default authMiddleware;
