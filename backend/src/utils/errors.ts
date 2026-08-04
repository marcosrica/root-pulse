//creamos clase de que extiende de error y despues hacemos subclases a partir de esa
export class AppError extends Error {
    public readonly cause: string;
    public readonly statusCode: number;
    
    //every error should have a cause, the statusCode and a message
    constructor(cause: string, message: string, statusCode: number) {

        super(message);

        this.cause = cause;
        this.statusCode = statusCode;
        //this line is necesarry in previous versions of ES2022 when extending from primitive types and avoid errors
        Object.setPrototypeOf(this, new.target.prototype)
    }

};

//---------------------------------------
//From here we make the specifics errors
//---------------------------------------

export class ValidationError extends AppError {
    constructor(cause: string, message: string){
        super(cause, message, 401);  //401--->Unauthorized

        this.name = "ValidationError";
    }
};

export class ExistenceError extends AppError {
    constructor(cause: string, message: string){
        super(cause, message, 409); //409--->Conflict

        this.name = "ExistenceError";
    }
};

export class DatabaseError extends AppError {
    constructor(cause: string, message: string) {
        super(cause, message, 500); //Server error

        this.name = "DatabaseError";
    }
};

export class TokenError extends AppError {
    constructor(cause: string, message: string) {
        super(cause, message, 500);

        this.name = "Token Error";
    }
};

