import User from "../Models/user.model.js";
import AppError from "../utils/error.util.js";

const cookieOptions = {
    maxAge: 7 *24* 60*60* 1000, // 7 days
    httpOnly: true,
    secure: true
}

const register = async (req, res)=>{
    const {fullName, email, password} = req.body;
    if(!fullName || !email || !password){
        return next (new AppError('All fields are required', 400));
    }
    const userExists = await User.findOne({email});
    if(userExists){
        return next (new AppError('Email already exists', 400))
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id: email,
            secure_url: 'https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png'
        }
    });
    if(!user){
        return next (new AppError('User registration field, please try agian', 400));

    }
    //TODO : fiel uploding
    await user.save();
    user.password = undefined;

    const token = await user.generrateJWTToken();

    res.cookie('token', token, cookieOptions)


    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    })
};

const login =async (req, res)=>{
    try{
        const {email, password} = req.body

        if(!email || !password){
            return next(new AppError('All fields are required', 400));
        }
        const user = await User.findOne({
            email
        }).select('+password');
        if(!user || !user.comparePassword(password)){
            return next (new AppError('Email or password does not match',400));
        }
        const token = await user.generrateJWTToken();
        user.password = undefined;
    
        res.cookie('token', token, cookieOptions);
        res.status(200).json({
            success: true,
            message: 'User login successfully',
            user,
        })
    }
    catch(e){
        return next(new AppError(e.message,500));
    }
}

const logout =(req, res)=>{
    res.cookie('token', null,{
        secure: true,
        maxAge: 0,
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    })
};

const getProfile = async(req, res)=>{
    try{
        const userId = req.user.id;
    const user = await User.findById(userId);
        res.status(200).json({
            success: true,
            message: "user details",
            user,
        });
    }
    catch(e){
        return next (new AppError('Failed to fetch profile Details', 500));
    }

}

export{
    register,
    login,
    logout,
    getProfile
}