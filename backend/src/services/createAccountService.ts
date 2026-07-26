import { UsersDatabase } from '../database/Database';
import bcrypt from 'bcrypt';

//Tipo de respuesta que devuelve un usuario credo, con fecha y todo
type UserRegistered = {
    id: number;
    username: string;
    createdTime: Date;
}
const db: UsersDatabase = new UsersDatabase();

const register = async( username: string, password: string): Promise<UserRegistered | null> => {
    //Comprobacion de campos con informacion
    if(!username.trim()) throw new Error('Username field must not be empty');
    if(!password.trim()) throw new Error('Password field must not be empty');
    if(password.length < 6) throw new Error('Password must be at least of 6 caracters');
    if(password.toLowerCase() == password) throw new Error('Passowrd must have at least one capital letter');
    if(password.includes(" ") || password.trim() != password) throw new Error('Password must not contain spaces');

    //comprobacion de usuario existente en minusculas para evitar situaciones de User1 = Maria; User2 = MaRiA
    const existingU = await db.findByUsername(username.toLowerCase());
    if(existingU) throw new Error('This username is already on use');

    //Una vez que comprobamos que se puede insertar el usuario hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 8);

    //Ahora guardamos al nuevo usuario en la base de datos y nos quedamos con el Id con el que se crea
    const userId = await db.createUser( username, hashedPassword);
    if(!userId) throw new Error('Internal db error')
    //si el usuario se ha creado devolvemos los datos y si no null
    return {
            id: userId,
            username: username,
            createdTime: new Date(),
            };
    }

export default register;