import mongoose from "mongoose";

const authorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 4
        },
        born: {
            type: Number,
        },
        bookCount: Number
    }
)

const Author = mongoose.model("Author", authorSchema)

export default Author