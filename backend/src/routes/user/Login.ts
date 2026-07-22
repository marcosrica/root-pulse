import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';


const userLogin = (req: Request, res: Response, next: NextFunction) => {
  let db:UsersDatabase = new UsersDatabase();

  console.log("Tried to login. Data: " + req.body.username + ";    " + req.body.password);

  db.CreateUser(req.body.username, req.body.password);

  res.status(200).send("OK");
};

export default userLogin;
