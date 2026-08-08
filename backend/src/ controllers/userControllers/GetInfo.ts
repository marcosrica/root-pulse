import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';


const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  const data: { name: string, password: string } = req.body;

  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    
    return res.status(200).send("OK");
  }
  else {
    return res.status(401).json({ cause: "No token present" });
  }
};

export default getUserInfo;
