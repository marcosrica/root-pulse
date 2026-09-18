import { Request, Response, NextFunction } from 'express';
import { SensorsDatabase } from '../../database/Database';
import bcrypt from 'bcrypt';
import { generateToken } from './../../utils/token';
import { ValidationError, ExistenceError, DatabaseError, TokenError } from './../../utils/errors';

const db = new SensorsDatabase(); 

type sensorLoginResponse = {
  id: number,
  name: string,
  token: string
}

type sensorLoginData = {
  name: string,
  password: string
}

const sensorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const {name, password}: {name: string, password: string} = req.body;

  try {
    //Trying to execute the service of loging an user and if anything went bad we can catch it
    const tryLogin = await sensorExecute({ name: name, password: password });

    res.cookie('sensor-token', tryLogin.token, {
      httpOnly: true,  //restricts the access to the token via JavaScript
      //secure: true --> token only send through https, as we are working in http localhost it doesnt send 
      // sameSite: 'strict', //cookie wont be went if the petition is from an external web
      maxAge: 3 * 60 * 60 * 1000 //cookie duration (3 hours)
    });

    return res.status(200).json({ response: "sensor logged in correctly",
      id: tryLogin.id,
      username: tryLogin.name,
    });

  } catch (error) {
    next(error);
  }
};

async function sensorExecute(data: sensorLoginData): Promise<sensorLoginResponse> {
  //First check that all the fields have been filled before consulting db
  if(!data.name) throw new ValidationError('NO_USERNAME','sensor name field must be filled');
  if(!data.password) throw new ValidationError('NO_PASSWORD','password field must be filled');

  //Then check if a sensor exists with that username
  const existingU = await db.findByName(data.name.toLowerCase());
  if(!existingU) throw new ExistenceError('NO_USERNAME_FOUND','There is no account with this username');

  //Checking if the provided password matches the one stored in the database
  //Using bcrypt to compare a plain text password against a hashed password
  const isValid = await bcrypt.compare(data.password, existingU.password);
  if(!isValid) throw new ValidationError('INVALID_PASSWORD', 'Invalid password');

  //If everything went on fine, we can generate the token
  const token = generateToken({ id: existingU.id,
    username: existingU.name
  });

  //Returning the data
  return { id: existingU.id, name: existingU.name, token: token };
}

export default sensorLogin;
