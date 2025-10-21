// task group model for grouping tasks
import mongoose from 'mongoose';

const taskGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    tasks: [
        {
            name: { type: String, required: true },
            checked: { type: Boolean, default: false },
            note: { type: String, required: false },
        }
    ],
    all_task_completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('TaskGroup', taskGroupSchema);