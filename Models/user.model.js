import{Schema, model} from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonebtoken'


const userSchema = new Schema({
        fullName: {
            type: 'String',
            require: [true, "Name is required"],
            minLength: [10, 'Name must be at least 10 char'],
            maxLength: [20, 'Name should be less than 20 char'],
            lowercase: true,
            trim: true,
        },
        email:{
            type: 'String',
            required: [true, 'Email is required'],
            trim: true,
            unique: true,
            lowercase: true,
            match: [/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'Please fill n a valid email address']

        },
        password:{
            type: 'String',
            password: [true, 'password is required'],
            minLength: [5, 'password must be at least 5 character'],
            select: false
        },
        avatar:{
            public_id:{
                type: 'String',
            },
            secure_url:{
                type: 'String'
            }
        },
        role:{
            type: 'String',
            enum: ["USER", 'ADMIN'],
            default: "USER"
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date
}, {
    timestamps: true
});
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10);
})
userSchema.method={
    generateJWTToken: async function(){
        return await jwt.sign(
            {
                id: this._id, email: this.email, subscription: this.subscription, role: this.role
            },
            {
                secret: process.env.JWT_SECRET
            },
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
            
        )
    },
    comparePassword: async function(plainTextPassword){
        return await bycrypt.compare(plainTextPassword, this.password);
    }
}

const User = model('User', userSchema);
export default User;