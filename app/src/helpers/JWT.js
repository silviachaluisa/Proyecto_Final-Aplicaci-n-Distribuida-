import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generarJWT = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

export default generarJWT;