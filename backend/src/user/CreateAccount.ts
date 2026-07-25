import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../database/Database';
import { userDbresultStatus } from '../errors/UserDBstatus';

const createNewAccount = async (req: Request, res: Response, next: NextFunction) => {
  let db: UsersDatabase = new UsersDatabase();

  // let username: string = req.body.username;
  // let password: string = req.body.password;
  //Esto es preferencia personal, y si fueran mas atributos de body podriamos crear un type para los tipos pero solo son dos
  const { username, password }: { username: string, password: string } = req.body;

  //primero comprobaciones de error y luego añadimos el usuario + codigos de estado correctos
  if(!username || !password){
    return res.status(400).json({ cause: "Must fill all fields"});
  }
  //
  try {
    
    
  } catch (error) {
    
  }

  //
  // if (username != "" && password != null) {
  //   let result:userDbresultStatus = await db.CreateUser(username, password);

  //   if (result == userDbresultStatus.AllOK) {
  //     res.status(200).json({ result: "OK" });
  //   }
  //   else {
  //     res.status(401).json({ cause: "Forbidden" });
  //   }
  // }
  // else {
  //   res.status(500).json({ cause: "Empty fields" });
  // }
};

export default createNewAccount;
