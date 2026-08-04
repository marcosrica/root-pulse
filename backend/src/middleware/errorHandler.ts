import { logger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    //create a logger with more info to track the user with the problem, using the user object we added to request
    const user = logger.child({ user: req.user?.username, userId: req.user?.id})
    //first check if the error is one of our defined errors
    if(error instanceof  AppError){

        //If error is of the server we show the log 
        if(error.statusCode >= 500){
            user.error(`${error.cause}, ${error.message}`);
        }
        else{
            user.info(`${error.cause}, ${error.message}`);
        };

        //Then we return the info to the client
        return res.status(error.statusCode).json({
        cause: error.cause,
        message: error.message
    });
    };

    //If the error is not of any of our define errors we keep it and response
    user.error('Unhandled error', error);
    return res.status(500).json({
        cause: "Internal server error",
    });

    
}

export default errorHandler;