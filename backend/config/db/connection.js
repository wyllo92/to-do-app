import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_app';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

mongoose.connection.on('connected', () => {
    console.log('connected to mongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose offline');
});

export { mongoose };