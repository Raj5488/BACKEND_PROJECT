import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
    
const connectionToDB = async () =>{
    try{
        const {connection} =  await mongoose.connect(
            process.env.MONGO_URI || `mongodb+srv://JITU-KUMAR:jitu5488@cluster0.msbmxqp.mongodb.net/`
            );
            if(connection){
                console.log(`Connected to MongoDB: ${connection}`);
            }
        
    }catch(e){
        console.log(e);
        process.exit(1);
    }
} 

export default connectionToDB;