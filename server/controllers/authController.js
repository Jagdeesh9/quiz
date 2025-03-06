import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({role: 'student'}).select("-password"); // Exclude password for security
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const assignQuizToStudent = async (req, res) => {
  const { studentId } = req.body;
  const { quizId } = req.params;

  try {
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.assignedQuizzes.push(quizId);
    await student.save();

    res.status(200).json({ message: "Quiz assigned successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, image } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({ name, email, password: hashedPassword, role, image });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const blacklistedTokens = new Set(); // Store invalidated tokens (Temporary Solution)

export const logout = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ message: "No token provided" });

    blacklistedTokens.add(token); // Add token to blacklist

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export {blacklistedTokens}
