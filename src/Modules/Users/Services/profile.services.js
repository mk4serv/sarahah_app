import { compareSync, hashSync } from "bcrypt";
import { BlacklistTokens, User } from "../../../DB/models/index.js";
import { Decryption } from "../../../Utils/encryption.utils.js";


// ✅ Get User Profile Service
export const profileServices = async (req, res) => {
    try {
        // ✅ Get the user ID from the request
        const { _id } = req.authUser;
        // ✅ Check the user from the database
        const user = await User.findById(_id);
        // ✅ Check if the user exists
        if (!user) return res.status(404).json({ message: 'User not found' });
        // ✅ Decrypt the phone number
        user.phone = await Decryption({ chiper: user.phone, secretKey: process.env.ENCRYPTION_SECRET_KEY });
        // ✅ Return the profile
        res.status(200).json({ message: 'Profile retrieved successfully', user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

// ✅ Update Profile Service
export const updateProfileServices = async (req, res) => {
    try {
        const { _id } = req.authUser;
        const { name, phone } = req.body;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// ✅ Update Password Service
export const updatePasswordServices = async (req, res) => {
    try {
        // ✅ Destructure the request body
        const { _id } = req.loggedInUser;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(_id);
        if(!user) return res.status(404).json({ message: 'User not found' });
        const isPasswordValid = compareSync(oldPassword, user.password);
        if(!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

        // ✅ hash the new password
        const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUNDS);
        user.password = hashedPassword;
        await user.save();

        // ✅ revoke user token
        await BlacklistTokens.create(req.loggedInUser.token);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}