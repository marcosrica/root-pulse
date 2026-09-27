import { Request, Response, NextFunction } from 'express';
import { SensorsDatabase, UsersDatabase } from '../../database/Database';
import { verifyToken } from '../../utils/token';

const db: SensorsDatabase = new SensorsDatabase();

const sendMeasure = async (req: Request, res: Response, next: NextFunction) => {
  //Trying to auth the sensor
  try {
    const verifiedToken = verifyToken(req.body.token);
    
    //Now, load the data from the Request
    const data = req.body.measure;

    if (data) {
      console.log("Sensor with ID: " + verifiedToken.id + " is sending measure " + data);
      const result = await db.addMeasure(verifiedToken.id, data);

      if (result) {
        //If everything went fine, return an OK
        res.status(200).json({ result: "OK" });
      }
      else {
        //If something went wrong, let the sensor know
        res.status(500).json({ result: "Server error" });
      }
    }
    else {
      return res.sendStatus(402).json({ reason: "No data present" });
    }
  }
  catch(e) {
    //The token is no longer present
    return res.status(401).json({ reason: "Sensor not logged in" });
  }
};

export default sendMeasure;
