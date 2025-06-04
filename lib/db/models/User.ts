import mongoose, { Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    image: {
      type: String,
    },
  },
  { 
    timestamps: true,
    // Add collection name explicitly to avoid pluralization issues
    collection: 'users'
  }
);

// Check if the model exists before creating it
// This prevents the "Cannot overwrite model once compiled" error in development
let User: Model<IUser>;

try {
  // Try to get the existing model
  User = mongoose.model<IUser>('User');
} catch (error) {
  // Model doesn't exist, create a new one
  User = mongoose.model<IUser>('User', UserSchema);
}

export default User; 