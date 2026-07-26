import { Request, Response} from 'express';
import { UsersDatabase } from '../../database/Database';
//No hace falta poner la ruta completa porque el archivo index hace que se pueda exportar como si fueran propiedades suyas
import { register } from '../../services'

const registerService = new register(new UsersDatabase());
const createNewAccount = async (req: Request, res: Response) => {

  //Esto es preferencia personal, y si fueran mas atributos de body podriamos crear un type para los tipos pero solo son dos
  const { username, password }: { username: string, password: string } = req.body;
  try {
    //hacemos una llamada al servicio dentro del try-catch para trabajar con los errores que lanzamos
    const tryCreateAccount = await registerService.execute(username, password);

    //Si se produce algun error se captura y se trata en el catch pero si no se llega a la siguiente respuesta de exito
    //200 = OK; 201 = Created mas especifico,
     return res.status(201).json({ 
                                    result: "User created succesfully",
                                    user: username,
                                    token: tryCreateAccount?.token,
                                    regiserDate: tryCreateAccount?.createdTime,
                                    
                                  });
    
    

  } catch (error) {
    //Error es de tipo unknown por defecto asi que tenemos que darle la condicion de que error es de tipo Error
    //futura ampliacion a errores personalizados
    if(error instanceof Error){

        //manejamos primero los errores de entrada de datos
      if(error.message === 'Username field must not be empty' || error.message === 'Password field must not be empty'){
        return res.status(400).json({ cause: "Some or all fields are incorrect"});
      }

      //Error lanzado por contraseña demasiado corta
      if(error.message === 'Password must be at least of 6 caracters'){
        return res.status(400).json({ cause: "Password too short"});
      }

      //Error lanzado si se detecta que no hay mayusculas
      if(error.message === 'Passowrd must have at least one capital letter'){
        return res.status(400).json({ cause: "Password must have at least one capital letter"});
      }

      //error lanzado si hay algun espacio en la contraseña
      if(error.message === 'Password must not contain spaces'){
        return res.status(400).json({ cause: "Password must not contain spaces"});
      }

      //Error lanzado si el usuario ya existe
      if( error.message === 'This username is already on use'){
        return res.status(400).json({ cause: "Username already in use"});
      }

      //Error si al intentar crear usuario se da un error a nivel de base de datos
      if(error.message === 'Internal db error'){
        return res.status(500).json({ cause: "Internal database error", error: error.message});
      }

      //Error al crear el token del usuario
      if(error.message === 'Error al crear el token'){
        return res.status(500).json({ cause: "Error while creating the token"});
      }

    }
  }
};

export default createNewAccount;
