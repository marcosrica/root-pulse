import { Request, Response, NextFunction } from 'express';

const userLogin = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("OK");
};

export default userLogin;