import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';


const addSensor = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Reached add sensor");
  res.status(200).send("OK");
};

export default addSensor;
