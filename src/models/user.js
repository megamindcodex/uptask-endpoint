// User model schema

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    content: { type: String },
    checked: { type: Boolean, required: true, default: false },
    note: { type: String },
}, { timestamps: true }); // timestamps for each task

const taskCollectionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    tasks: [taskSchema],
}, { timestamps: true }); // timestamps for each task collection

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    taskCollections: [taskCollectionSchema],
    _resetPasswordCode: { type: String },
    _resetCodeExpires: { type: Date },
}, { timestamps: true }); // timestamps for each user


export default mongoose.model('User', userSchema);
