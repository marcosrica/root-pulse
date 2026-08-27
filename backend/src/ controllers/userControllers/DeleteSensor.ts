import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';


const addSensor = async (req: Request, res: Response, next: NextFunction) => {
  const rawId = req.query.id;
  if (!rawId || Array.isArray(rawId)) {
    return res.status(400).json({ error: 'missing parameter' });
  }

  const sensorId = Number(rawId);
  if (isNaN(sensorId) || sensorId < 0) {
    return res.status(400).json({ error: 'parameter is not a positive number' });
  }
  
  console.log("Delete endpoint ", sensorId);

  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    const db: UsersDatabase = new UsersDatabase();
    let result = await db.deleteSensor(userId, sensorId);
    console.log(result);

    if (result) {
      return res.status(200).send("OK");
    }
    else {
      return res.status(500).json({ cause: "Internal error" });
    }
  }
  else {
    return res.status(401).json({ cause: "No token present" });
  }
};

export default addSensor;
