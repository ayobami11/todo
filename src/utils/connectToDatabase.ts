import mongoose from 'mongoose';

const connectToDatabase = async () => mongoose.connect(process.env.MONGODB_URI as string);

export default connectToDatabase;