import { model, Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'Title is required'],
        minLength: [8, 'Title must be at least 8 character'],
        maxLength: [59, 'Title should be less than 60 character'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        maxlength: [1000, 'Description should be less than 1000 characters'], // Add this validation
      },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    thumbnail: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String 
                },
                secure_url: {
                    type: String
                }
            }
        }
    ],
    numberOfLectures: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    })

const Course = model("Course", courseSchema);

export default Course