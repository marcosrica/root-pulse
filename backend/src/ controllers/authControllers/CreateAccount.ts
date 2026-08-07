import { Request, Response, NextFunction } from 'express';
import { UsersDatabase } from '../../database/Database';
//No hace falta poner la ruta completa porque el archivo index hace que se pueda exportar como si fueran propiedades suyas
import { register } from '../../services'
import type { UserRegistered } from '../../services/createAccountService';

const registerService = new register(new UsersDatabase());
const createNewAccount = async (req: Request, res: Response, next: NextFunction) => {

  //Esto es preferencia personal, y si fueran mas atributos de body podriamos crear un type para los tipos pero solo son dos
  const { username, password }: { username: string, password: string } = req.body;
  try {
    //hacemos una llamada al servicio dentro del try-catch para trabajar con los errores que lanzamos
    const tryCreateAccount: UserRegistered = await registerService.execute(username, password);
    console.log("Created account. Token: " + tryCreateAccount.token);

    //Si se produce algun error se captura y se trata en el catch pero si no se llega a la siguiente respuesta de exito
    //200 = OK; 201 = Created mas especifico,
    //now we send the token as a cookie
          res.cookie('token', tryCreateAccount.token, {
              httpOnly: true,  //restricts the access to the token via JavaScript
              // secure: true,   //token only send through https, we are in http
              // sameSite: 'strict', //cookie wont be went if the petition is from an external web
              secure: false,   //token only send through https, we are in http
              sameSite: 'lax',
              maxAge: 3 * 60 * 60 * 1000, //cookie duration (3 hours)
              path: '/',
    
          })
     return res.status(201).json({ 
                                    result: "User created succesfully",
                                    user: username,
                                    regiserDate: tryCreateAccount.createdTime,
                                  });
    
    

  } catch (error) {
    //Now errors are managed in the middleware
    next(error);
  }
};

export default createNewAccount;
