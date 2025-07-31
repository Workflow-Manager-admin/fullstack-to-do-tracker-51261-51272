//
// MongoDB/Mongoose Model Definitions for To-Do Tracker
//
// This file defines standardized schemas/models for 'users' and 'tasks' collections.
//

const mongoose = require('mongoose');

const { Schema } = mongoose;

// PUBLIC_INTERFACE
/**
 * Connect to MongoDB with the supplied URI (from env) and database name.
 * Returns the connected mongoose instance or throws error upon failure.
 * @param {string} mongoUri MongoDB connection string (e.g. from MONGODB_URL env var)
 * @param {string} dbName   MongoDB database name (e.g. from MONGODB_DB env var)
 */
async function connectToMongoDB(mongoUri, dbName) {
    /**
     * Connects the mongoose client.
     * @returns Promise<Mongoose>
     */
    if (mongoose.connection.readyState === 1) return mongoose; // already connected

    try {
        await mongoose.connect(mongoUri, {
            dbName,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected:', dbName);
        return mongoose;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}

// PUBLIC_INTERFACE
/**
 * User Schema/Model
 * Represents an authenticated user for the To-Do Tracker.
 * Includes email (unique), hashed password, and creation timestamp.
 */
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+@.+\..+/,
        description: 'The user\'s email address (unique identifier).',
    },
    password: {
        type: String,
        required: true,
        description: 'User password hash, NOT the plaintext password.',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        description: 'Timestamp of user account creation.',
    }
}, { collection: 'users' });

/**
 * The User mongoose model.
 */
const User = mongoose.models.User || mongoose.model('User', userSchema);

// PUBLIC_INTERFACE
/**
 * Task Schema/Model
 * Represents a task belonging to a user.
 */
const taskSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        description: 'Reference to the task owner\'s user _id.',
    },
    title: {
        type: String,
        required: true,
        trim: true,
        description: 'Title or name/description of the task.',
    },
    description: {
        type: String,
        default: '',
        trim: true,
        description: 'Optional detailed description of the task.',
    },
    category: {
        type: String,
        default: 'general',
        trim: true,
        description: 'Optional string categorizing the task.',
    },
    dueDate: {
        type: Date,
        description: 'Optional date/time when task is due.',
    },
    isCompleted: {
        type: Boolean,
        default: false,
        description: 'Whether the task is marked as completed.',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        description: 'Timestamp of task creation.',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        description: 'Timestamp of last update to this task.',
    }
}, { collection: 'tasks' });

taskSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

/**
 * The Task mongoose model.
 */
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

// PUBLIC_INTERFACE
module.exports = {
    connectToMongoDB,
    User,
    Task,
    userSchema,
    taskSchema
};
