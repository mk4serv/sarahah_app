import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: [3, 'Username cannot be less than 3 characters'],
        maxLength: [20, 'Username cannot be more than 20 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password cannot be less than 8 characters']
    },
    age: {
        type: Number,
        required: true,
        min: [18, 'Age cannot be less than 18']
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String,
        default: 'default.png'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);