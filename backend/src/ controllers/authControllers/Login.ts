import { Request, Response } from 'express';
import { login } from '../../services';
import { UsersDatabase } from '../../database/Database';

const loginService = new login(new UsersDatabase());

const userLogin = async (req: Request, res: Response) => {

  const {username, password}: {username: string, password: string} = req.body;
  try {
    //we try to execute the service of loging an user and if anything went bad we can catch it
    const tryLogin = await loginService.execute({username: username, password: password});

res.cookie('token', tryLogin.token, {
              httpOnly: true,  //restricts the access to the token via JavaScript
             //secure: true --> token only send through https, as we are working in http localhost it doesnt send 
              // sameSite: 'strict', //cookie wont be went if the petition is from an external web
              maxAge: 3 * 60 * 60 * 1000 //cookie duration (3 hours)
});

    return res.status(200).json({ response: "user logged in correctly",
                                  id: tryLogin.id,
                                  username: tryLogin.username,
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
    console.error("internal error while login: ", error);
    return res.status(500).json({ cause: "Unknown error ocurred in server"});
  }
};

export default userLogin;
