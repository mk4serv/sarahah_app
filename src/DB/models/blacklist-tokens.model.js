import mongoose from "mongoose";

const BlacklistTokensSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

const BlacklistTokens = mongoose.models.BlacklistTokens || mongoose.model('BlacklistTokens', BlacklistTokensSchema);

export default BlacklistTokens;