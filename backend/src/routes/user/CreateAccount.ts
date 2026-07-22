import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';
import { userDbresultStatus } from '../../errors/UserDBstatus';

const createNewAccount = async (req: Request, res: Response, next: NextFunction) => {
  let db: UsersDatabase = new UsersDatabase();

  let username: string = req.body.username;
  let password: string = req.body.password;

  if (username != "" && password != null) {
    let result:userDbresultStatus = await db.CreateUser(username, password);

    if (result == userDbresultStatus.AllOK) {
      res.status(200).json({ result: "OK" });
    }
    else {
      res.status(401).json({ cause: "Forbidden" });
    }
  }
  else {
    res.status(500).json({ cause: "Empty fields" });
  }
};

export default createNewAccount;
