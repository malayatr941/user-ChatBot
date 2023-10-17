import { IUser } from "@interfaces";
import { Schema,model } from "mongoose";

const userSchema = new Schema<IUser>({
     name: {
        type: String,
        required: true
     },
     email: {
        type: String,
        required: true
     },
     password: {
        type: String,
        required:true
     },
     company:{
      type: String,
      required:true
     },
     token:{
       type:String,
       required:true
     },
     createdAt: {
        type: Date,
        default: new Date()
     },
     avatar: String
})

export default model('User',userSchema);