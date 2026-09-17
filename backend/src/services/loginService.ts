import { UsersDatabase } from '../database/Database';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token'
import { ValidationError, ExistenceError, DatabaseError, TokenError } from '../utils/errors';

type loginResponse = {
  id: number,
  username: string,
  token: string
}

type loginData = {
  username: string,
  password: string
}
export class login {
  constructor(private db: UsersDatabase) {}

  async execute(data: loginData): Promise<loginResponse> {
    //First check that all the fields have been filled before consulting db
    if(!data.username) throw new ValidationError('NO_USERNAME','username field must be filled');
    if(!data.password) throw new ValidationError('NO_PASSWORD','password field must be filled');

    //Then check that an account exists with that username
    const existingU = await this.db.findByUsername(data.username.toLowerCase());
    if(!existingU) throw new ExistenceError('NO_USERNAME_FOUND','There is no account with this username');

    //Checking if the provided password matches the one stored in the database
    //Using bcrypt to compare a plain text password against a hashed password
    const isValid = await bcrypt.compare(data.password, existingU.password);
    if(!isValid) throw new ValidationError('INVALID_PASSWORD', 'Invalid password');

    //If everything went on fine, we can generate the token
    const token = generateToken({ id: existingU.id,
      username: existingU.username
    });

    //Returning the data
    return { id: existingU.id, username: existingU.username, token: token };
  }
}

export default login;