import { Request, Response, NextFunction } from 'express';


const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    return res.status(200).json({ result: "OK" });
  }
  else {
    return res.status(401).json({ cause: "No token present" });
  }
};

export default isLoggedIn;