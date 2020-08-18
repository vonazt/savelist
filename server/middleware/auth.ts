import { RequestHandler } from 'express';

const authMiddleware: RequestHandler = (req, res, next) => {
  console.log('AUTH', req.headers);
};

export default authMiddleware
