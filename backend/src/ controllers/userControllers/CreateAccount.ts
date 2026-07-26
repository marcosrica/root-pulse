import { Request, Response} from 'express';
import { UsersDatabase } from '../../database/Database';
//No hace falta poner la ruta completa porque el archivo index hace que se pueda exportar como si fueran propiedades suyas
import { register } from '../../services'


const createNewAccount = async (req: Request, res: Response) => {

  //Esto es preferencia personal, y si fueran mas atributos de body podriamos crear un type para los tipos pero solo son dos
  const { username, password }: { username: string, password: string } = req.body;
  try {
    //hacemos una llamada al servicio dentro del try-catch para trabajar con los errores que lanzamos
    const tryCreateAccount = register(username, password);

    //Si se produce algun error se captura y se trata en el catch pero si no se llega a la siguiente respuesta de exito
    //200 = OK; 201 = Created mas especifico, esta comprobacion es de emergencia porque hay que hacer algo complicado con los tipos
    if(tryCreateAccount != null ){
      res.status(201).json({ result: "User created succesfully"});
    }
    
    

  } catch (error) {
    //Error es de tipo unknown por defecto asi que tenemos que darle la condicion de que error es de tipo Error
    //futura ampliacion a errores personalizados
    if(error instanceof Error){

        //manejamos primero los errores de entrada de datos
      if(error.message === 'Username field must not be empty' || 'Password field must not be empty'){
        res.status(400).json({ cause: "Some or all fields are incorrect"});
      }

      //Error lanzado por contraseña demasiado corta
      if(error.message === 'Password must be at least of 6 caracters'){
        res.status(400).json({ cause: "Password too short"});
      }

      //Error lanzado si el usuario ya existe
      if( error.message === 'This username is already on use'){
        res.status(400).json({ cause: "Username already in use"})
      }

      //Error si al intentar crear usuario se da un error a nivel de base de datos
      if(error.message === 'Internal db error'){
        res.status(500).json({ cause: "Internal server error"})
      }

    }
  }
};

export default createNewAccount;
