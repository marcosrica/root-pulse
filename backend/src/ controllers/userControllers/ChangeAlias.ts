import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';


const ChangeAlias = async (req: Request, res: Response, next: NextFunction) => {
  const data: { sensor: number, alias: string } = req.body;
  console.log(data);
  
  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    //Changing the alias to the sensor
    const db:UsersDatabase = new UsersDatabase();
    const result:boolean = await db.changeAlias(userId, data.sensor, data.alias);

    if (result) {
      return res.status(200).send("OK");
    }
    else {
      return res.status(500).json({ cause: "Internal server error" });
    }
  }
  else {
    return res.status(401).json({ cause: "No token present" });
  }
};

export default ChangeAlias;
