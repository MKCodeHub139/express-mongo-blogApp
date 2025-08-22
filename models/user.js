import { model, Schema } from "mongoose";
import {createHmac, randomBytes} from 'crypto'

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salt:{
        type:String,
  },
  password: {
    type: String,
    required: true,

  },
  profileImageUrl:{
    type:String,
    default:'/images/avatar.svg'
  },
  role:{
    type:String,
    enum:['USER',"ADMIN"],
    default:'USER'
  }
},{timestamps:true});

userSchema.pre('save',function(next){
    const user =this
    if(!user.isModified('password')) return
      const salt =randomBytes(16).toString()
      const hashPassword =createHmac('sha256',salt).update(user.password).digest('hex')
      this.salt =salt
      this.password =hashPassword
      next()
})
userSchema.static('matchPassword',async function (email,password) {
    const user =await this.findOne({email})
    if(!user) throw new Error('user not defined');

    const salt =user.salt
    const hashedPassword =user.password
      const useProvidedHash =createHmac('sha256',salt).update(password).digest('hex')
    if(hashedPassword !==useProvidedHash) throw new Error('incorrect password')
    return {...user,password:undefined,salt:undefined}
})
const User =model('user',userSchema)

export default User