import { UsersDatabase } from '../database/Database';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token'

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
        //first check that all fields are filled before consulting db
        if(!data.username) throw new Error('username field must be filled');
        if(!data.password) throw new Error('password field must be filled');

        //comprobamos que exista el usuario con el username
        const existingU = await this.db.findByUsername(data.username.toLowerCase());
        if(!existingU) throw new Error('There is no username with this username');

        //checking if the password is the same as in the database, this method compares a plain text password with the 
        //hashed password in our database and returns a boolean
        const isValid = await bcrypt.compare(data.password, existingU.password);
        if(!isValid) throw new Error('Invalid password');

        //if everything is alright we can generate the token
        const token = generateToken({ id: existingU.id,
                                            username: existingU.username
                                        });
    
        return { id: existingU.id, username: existingU.username, token: token };

    }
}

export default login;