import { UsersDatabase } from '../database/Database';
import bcrypt from 'bcrypt';

//Tipo de respuesta que devuelve un usuario credo, con fecha y todo
type UserRegistered = {
    id: number;
    username: string;
    createdTime: Date;
}
const db: UsersDatabase = new UsersDatabase();

const register = async( username: string, password: string): Promise<UserRegistered> => {
    //Comprobacion de campos con informacion
    if(!username.trim()) throw new Error('Username field must not be empty');
    if(!password.trim()) throw new Error('Password field must not be empty');
    if(password.length < 6) throw new Error('Password must be at least of 6 caracters');

    //comprobacion de usuario existente en minusculas para evitar situaciones de User1 = Maria; User2 = MaRiA
    const existingU = await db.findByUsername(username.toLowerCase());
    if(existingU) throw new Error('This username is already on use');

    //Una vez que comprobamos que se puede insertar el usuario hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 8);

    //Ahora guardamos al nuevo usuario en la base de datos y nos quedamos con el Id con el que se crea
    const userId = await db.createUser( username, hashedPassword);

    return {
        id: userId,
        username: username,
        createdTime: new Date(),
    };
}

export default register;