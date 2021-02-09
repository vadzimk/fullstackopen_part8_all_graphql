import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 3
        },
        favoriteGenre: {
            type: String,
            required: true,
        }
    }
)

const User = mongoose.model("User", userSchema)

export default User