import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';


const addSensor = async (req: Request, res: Response, next: NextFunction) => {
  const data: { name: string, password: string } = req.body;

  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    const db: UsersDatabase = new UsersDatabase();

    const result = await db.getConnectedSensors(userId);
    
    console.log("REached sensor connection with user id ", result);
    return res.status(200).json(result);
  }
  else {
    return res.status(401).json({ cause: "No token present" });
  }
};

export default addSensor;
