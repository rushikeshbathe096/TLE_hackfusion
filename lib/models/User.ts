import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: {
    type: String,
    enum: ['citizen', 'authority', 'staff'],
    default: 'citizen'
  },
  department: {
    type: String,
    enum: ['Road', 'Water', 'Electrical', 'Sanitation'],
    required: function (this: any) { return this.role === 'authority' || this.role === 'staff'; }
  },

  // Profile Fields
  dob: { type: Date },
  phoneNumber: { type: String },
  address: { type: String },
  profileImage: { type: String },
  govtIdUrl: { type: String }, // For staff/authority

  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = (mongoose.models && mongoose.models.User) ? mongoose.models.User : mongoose.model('User', UserSchema);

export default User;
