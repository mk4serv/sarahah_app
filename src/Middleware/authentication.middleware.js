
import { BlacklistTokens, User } from '../DB/models/index.js';
import { verifyToken } from '../Utils/tokens.utils.js';

export const authenticationMiddleware = () => {
    return async (req, res, next) => {
        try {
            const { accesstoken } = req.headers;
            if (!accesstoken) {
                return res.status(400).json({ message: 'Please login' });
            }
            // ✅ Verify the token
            const decodedData = verifyToken({ token: accesstoken, secretKey: process.env.JWT_SECRET_LOGIN_KEY });

            // ✅ Check if the token is blacklisted
            const isBlacklisted = await BlacklistTokens.findOne({ tokenId: decodedData.jti });
            if (isBlacklisted) return res.status(401).json({ message: 'Token expired. Please login again' });

            // ✅ Get the user ✅ Check if the user exists
            const user = await User.findById(decodedData._id,{ password: 0, __v: 0 }).lean();
            if (!user) return res.status(404).json({ message: 'Please Signup First' });

            // ✅ Set the user on the request
            req.authUser = user
            req.loggedInUser = {...user,token: { tokenId: decodedData.jti, expiresAt: decodedData.exp }};

            next();
        } catch (error) {
            console.log(error);
            if (error.name === 'jwt expired') {
                return res.status(401).json({ message: 'Token expired. Please login again' });
            }
            return res.status(401).json({ message: 'Something went wrong' });
        }

    }
}