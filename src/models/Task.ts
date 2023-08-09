import mongoose from 'mongoose';

interface ITask {
    userId: mongoose.Types.ObjectId,
    message: string,
    completed: boolean
}

const TaskSchema = new mongoose.Schema<ITask>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);