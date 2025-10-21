// User model schema

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    taskCollection: [
        {
            id: { type: String, required: true, unique: true },
            name: { type: String, required: true },
            description: { type: String, required: false },
            tasks: [
                {
                    content: { type: String, required: true },
                    checked: { type: Boolean, default: false },
                    note: { type: String, required: false },
                    id: { type: String, required: true, unique: true },
                }
            ],
            all_task_completed: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now },
        }
    ],
    _resetPasswordCode: { type: String },
    _resetCodeExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
