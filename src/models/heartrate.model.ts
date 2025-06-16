import mongoose, { Schema } from "mongoose";

export const HeartRate = mongoose.model(
  "heartrate",
  new mongoose.Schema({
    averagerate: {
      type: Number,
      required: true,
      min: 1,
      max: 300,
    },
    bloodpresure: {
      type: String, //  chuoi phan so
      required: true,
    }, 
    maxrate:{
      type: Number,
    }, 
    minrate: {
      type: Number,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  })
);