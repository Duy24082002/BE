import mongoose from "mongoose";

/**
 * Represents a single measurement of the heart rate.
 * @field time - The point in time when the measurement was taken
 * @field beatsPerMinute - Heart beats per minute. Validation range: 1 - 300
 */
export interface ISample {
  time: string;
  beatsPerMinute: number;
}
const sampleSchema = new mongoose.Schema<ISample>(
  {
    time: {
      type: String,
      required: true,
    },
    beatsPerMinute: {
      type: Number,
      required: true,
      min: 1,
      max: 300,
    },
  },
  {
    timestamps: true,
  }
);
export const Sample = mongoose.model<ISample>("Sample", sampleSchema);
