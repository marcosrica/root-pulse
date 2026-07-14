import { Request, Response, NextFunction } from 'express';

const userLogin = (req: Request, res: Response, next: NextFunction) => {
  console.log("Tried to login. Data: " + req.body.username + ";    " + req.body.password);
  res.status(200).send("OK");
};

export default userLogin;