import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';


const setLanguage = async (req: Request, res: Response, next: NextFunction) => {
  const data: { name: string, password: string } = req.body;

  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    const db: UsersDatabase = new UsersDatabase();
    const result: boolean = await db.setLanguage(userId, req.body.language);

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

export default setLanguage;
