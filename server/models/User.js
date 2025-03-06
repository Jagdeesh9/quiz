import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    
    image: { type: String, default: "https://static.vecteezy.com/system/resources/previews/048/216/761/large_2x/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png" }, // Store image URL
    assignedQuizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
