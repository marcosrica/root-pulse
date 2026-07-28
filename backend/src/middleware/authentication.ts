import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/token';

//declaramos un elemento opcional user en nuestra request
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
            }
        }
    }
}

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    
        //extract the value of the property of authorization of the headers of the request, the token must be here instead of in the body
        //with a type of Bearer 
        const token: string = req.cookies.token;
        //if there is no token in the authorization/headers request we cannot authenticate the user
        if(!token){
            return res.status(401).json({ cause: "No token provided"});
        }

    try {
        //now we verify the token and update the body info if its valid and go to the requested endpoint
        const verified = verifyToken(token);
        //instead of modifying the client request we modify an user object
        req.user = {
            id: verified.id,
            username: verified.username
        }
        next();
    } catch (error) {
        //catch error that throws the verify function when token is expired
        if(error instanceof jwt.TokenExpiredError){
            return res.status(401).json({ cause: "Expired token" ,message: "Your sesion has expired, login again"})
        }
        //catch error that throws the verify function of jwt when the token is invalid
        if(error instanceof jwt.JsonWebTokenError){
            return res.status(401).json({ cause: "Invalid or malformed token" });
        }

        //if there is another error we catch it with a general message
        return res.status(401).json({ cause: "unknown authentication failed", message: "Unable to authenticate the token"});
    }
}

//when more middleware added this will change
export default authentication;