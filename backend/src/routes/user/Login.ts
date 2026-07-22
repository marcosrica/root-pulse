import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';


const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  let db:UsersDatabase = new UsersDatabase();

  console.log("Tried to login. Data: " + req.body.username + ";    " + req.body.password);

  let result:number = await db.CheckForUser(req.body.username, req.body.password);

  if (result != -1) {
    res.status(200).json({ id: result });
  }
  else {
    res.status(401).json({ cause: "Wrong credentials" });
  }
};

export default userLogin;
