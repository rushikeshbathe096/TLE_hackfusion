import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto-delete after 10 min
});

const OTP = (mongoose.models && mongoose.models.OTP) ? mongoose.models.OTP : mongoose.model('OTP', OTPSchema);

export default OTP;
