import { Request, Response, NextFunction } from 'express';
import { UsersDatabase, SensorsDatabase } from '../../database/Database';


const addSensor = async (req: Request, res: Response, next: NextFunction) => {
  const data: { name: string, password: string } = req.body;

  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    //Now checking if sensor credentials are right
    const SensorsDb: SensorsDatabase = new SensorsDatabase();
    const sensorId: number = await SensorsDb.sensorExists(data.name, data.password);

    if (sensorId != -1) {
      //Sensor credentials are fine. Proceeding to connect the user and the sensor
      const usersDb: UsersDatabase = new UsersDatabase();
      const insertionResult: boolean = await usersDb.addConnection(userId, sensorId, true);

      //Checking if insertion went correctly, or if something went wrong in the process
      if (insertionResult) {
        return res.status(200).send("OK");
      }
      else {
        return res.status(500).json({ cause: "Internal server error" });
      }
    }
    else {
      return res.status(401).json({ cause: "Incorrect sensor credentials" });
    }
  }
  else {
    return res.status(401).json({ cause: "No token present" });
  }
};

export default addSensor;
