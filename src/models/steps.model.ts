import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IStepsRecord extends Document {
  starttime: string;
  endtime: string;
  count: number;
}

const stepsSchema = new Schema<IStepsRecord>(
  {
    starttime: {
      type: String,
      required: true,
    },
    endtime: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IStepsRecord>("Steps", stepsSchema);
