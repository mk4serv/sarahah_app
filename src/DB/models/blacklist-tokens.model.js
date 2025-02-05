import mongoose from "mongoose";

const BlacklistTokensSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
},{timestamps: true});

const BlacklistTokens = mongoose.models.BlacklistTokens || mongoose.model('BlacklistTokens', BlacklistTokensSchema);

export default BlacklistTokens;