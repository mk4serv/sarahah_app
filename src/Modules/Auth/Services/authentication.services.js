import { compareSync, hashSync } from "bcrypt";
import User from "../../../DB/models/user.model.js";
import { Encryption } from "../../../Utils/encryption.utils.js";
import { emitter } from "../../../Services/send-email.services.js";
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import BlackListTokens from "../../../DB/models/blacklist-tokens.model.js";

// ✅ Sign Up Service
export const SignUpservices = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, phone, age } = req.body;

        // ✅ Confirm Password Check
        if (!confirmPassword || password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // ✅ Check if email already exists
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // ✅ Check if phone already exists
        const isPhoneExist = await User.findOne({ phone });
        if (isPhoneExist) {
            return res.status(409).json({ message: 'Phone number already exists' });
        }

        // ✅ Hash the password
        const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);

        // ✅ Encrypt the phone number
        const encryptedPhone = Encryption({ value: phone, secretKey: process.env.ENCRYPTION_SECRET_KEY });

        // ✅ Generate JWT
        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });

        // ✅ Confirm Email Link
        const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`

        // ✅ Send verification Email
        emitter.emit('sendEmail', [
            email,
            'Verify Your Email',
            { text: 'Verify Your Email', data: username, confirmEmailLink },
            []
        ]);

        // ✅ Create a new user
        const newUser = await User.create({ username, email, password: hashedPassword, phone: encryptedPhone, age });
        if (!newUser) {
            return res.status(500).json({ message: 'User creation failed, please try again' });
        }

        // ✅ Success Response
        return res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        console.error('Sign Up error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
// ✅ Verify Email Service
export const VerifyEmailServices = async (req, res) => {
    try {
        const { token } = req.params;
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decodedData);
        const user = await User.findOneAndUpdate({ email: decodedData.email }, { isEmailVerified: true }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Email verified successfully', user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// ✅ Login Service
export const LoginServices = async (req, res) => {
    try {

        const { email, password } = req.body;

        // ✅ Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        // ✅ Check if the password is correct
        const isPasswordCorrect = compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // ✅ Generate JWT
        const accesstoken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET_LOGIN_KEY, { expiresIn: '2h', jwtid: uuid() });
        const refreshtoken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET_REFRESH_KEY, { expiresIn: '2d', jwtid: uuid() });

        return res.status(200).json({ message: 'Logged in successfully', isPasswordCorrect, accesstoken, refreshtoken });


    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}

export const RefreshTokenServices = async (req, res) => {
    try {
        const { refreshtoken } = req.headers;
        const decodedData = jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH_KEY);
        const accesstoken = jwt.sign({ _id: decodedData._id, email: decodedData.email }, process.env.JWT_SECRET_LOGIN_KEY, { expiresIn: '2h' });
        res.status(200).json({ message: 'Token refreshed successfully', accesstoken });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

export const LogoutServices = async (req, res) => {
    try {
        const { accesstoken, refreshtoken } = req.headers;
        const decodedData = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN_KEY);
        const decodedRefreshToken = jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH_KEY);

        const revokeToken = await BlackListTokens.insertMany(
            [
                {
                    tokenId: decodedData.jti,
                    expiresAt: decodedData.exp
                },
                {
                    tokenId: decodedRefreshToken.jti,
                    expiresAt: decodedRefreshToken.exp
                }
            ]
        );
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}