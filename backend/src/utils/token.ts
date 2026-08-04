import jwt from 'jsonwebtoken';

type tokenInfo = {
    id: number,
    username: string
}

const SECRET_SEED = process.env.JWT_SECRET_PSWD || 'contraseñaPorDefecto';
const TIME = process.env.JWT_EXPIRES_IN || '1h';

//el argumento payload es la informacion del usuario a partir de la cual se crea el token asi que tiene
//que ser informacion que no se vaya a cambiar regularmente
export const generateToken = (payload: tokenInfo): string => {
    //problemas con los argumentos al intentar poner TIME
return jwt.sign(payload, SECRET_SEED, { expiresIn: '1d'});
};

export const verifyToken = (token: string): tokenInfo => {
    try {
        //verificamos el token y forzamos el tipo de la respuesta a nuestro tokenInfo
        return jwt.verify(token, SECRET_SEED) as tokenInfo;
    }catch(error) {
        //throw the error produced to treat it in the middleware
        throw error;
    }
};



