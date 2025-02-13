import mongoose, { Document, Model } from 'mongoose';

// Define an interface for a User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the user schema with validations
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'User Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'User Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'User Password is required'],
    minLength: 6,
  }
}, { timestamps: true });

// Create a Mongoose model with the IUser interface
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
