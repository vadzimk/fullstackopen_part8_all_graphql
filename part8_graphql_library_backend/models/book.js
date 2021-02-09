// mongoose schema for book entity class

import mongoose from 'mongoose'


const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            minlength: 2
        },
        published: {
            type: Number,
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Author'
        },
        genres: [
            {type: String}
        ]
    }
)


const Book = mongoose.model("Book", bookSchema)

export default Book