import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  firstname: string;
  middlename: string;
  lastname: string;
  birthdate: Date;
  roles: string[];
  refreshToken?: string;
  verified: boolean;
  accessToken?: string | null;
  avatarUrl?: string;
  created: Date;
  modified: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    middlename: {
      type: String,
      required: false,
      trim: true,
    },
    lastname: {
      type: String,
      required: false,
      trim: true,
    },
    birthdate: {
      type: Date,
      required: false,
    },
    //todo: change logic for permission
    roles: {
      type: [String],
      default: ["user"],
      enum: ["user", "admin", "doctor"],
    },
    refreshToken: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model<IUser>("User", userSchema);
