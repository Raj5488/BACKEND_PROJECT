import AppError from "../utils/error.util";
import Jwt from "jsonwebtoken";
const isLoggedIn = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new AppError('Unauthenticated, please login agian',400));
    }
    const userDetails =await jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;
    next();
}
export {
    isLoggedIn
}