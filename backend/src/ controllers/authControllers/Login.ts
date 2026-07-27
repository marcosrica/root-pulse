import { Request, Response } from 'express';
import { login } from '../../services';
import { UsersDatabase } from '../../database/Database';

const loginService = new login(new UsersDatabase());

const userLogin = async (req: Request, res: Response) => {

  const {username, password}: {username: string, password: string} = req.body;
  try {
    //we try to execute the service of loging an user and if anything went bad we can catch it
    const tryLogin = await loginService.execute({username: username, password: password});

    return res.status(200).json({ response: "user logged in correctly",
                                  id: tryLogin.id,
                                  username: tryLogin.username,
                                  token: tryLogin.token
    });

  } catch (error) {
    if(error instanceof Error){
      //errors of unfilled fields
      if(error.message === 'username field must be filled'){
        return res.status(400).json({ cause: "username field must be filled"});
      };
      if(error.message === 'password field must be filled'){
        return res.status(400).json({ cause: "password field must be filled"});
      };

      //error of incorrect username
      if(error.message === 'There is no username with this username'){
        return res.status(400).json({ cause: "There is no user with the username provided"});
      }

      //error of invalid password
      if(error.message === 'Invalid password'){
        return res.status(400).json({ cause: "Invalid password"});
      }
      
    }
  }
};

export default userLogin;
