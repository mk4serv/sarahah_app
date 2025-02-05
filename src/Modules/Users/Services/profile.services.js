import BlacklistTokens from "../../../DB/models/blacklist-tokens.model.js";
import User from "../../../DB/models/user.model.js";
import { Decryption } from "../../../Utils/encryption.utils.js";
import jwt from "jsonwebtoken"

export const profileData = async (req, res) => {
    try {
        // ✅ Get the user
        const { accesstoken } = req.headers;
        if (!accesstoken) {
            return res.status(401).json({ message: 'JWT must be provided' });
        }
        const decodedData = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN_KEY);
        // ✅ Check if the user Blacklisted
        const isBlacklisted = await BlacklistTokens.findOne({ tokenId: decodedData.jti });
        if (isBlacklisted) return res.status(401).json({ message: 'Please login again' });
        const user = await User.findById(decodedData._id);
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