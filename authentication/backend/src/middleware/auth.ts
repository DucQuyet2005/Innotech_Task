import type {Request,Response,NextFunction} from 'express';

import jwt from 'jsonwebtoken';

interface JwtPayload{
    userId:number;
    email:string;
}

export const authenticate =(req:Request, res: Response,next:NextFunction)=>
{
    const token = req.cookies.token;
    if(!token)
    {
        return res.status(401).json({message:'Unauthorize:No token'});
    }
    try{
        const decoded =jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;
        req.userId=decoded.userId;
        req.userEmail=decoded.email;
        next();

    }catch(err)
    {
        return res.status(401).json({message:'Invailid or expered token'});
    }
};