import { Request, Response, NextFunction } from 'express';

const createNewAccount = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("OK");
};

export default createNewAccount;