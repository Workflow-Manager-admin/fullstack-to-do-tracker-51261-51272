# todo_database

This directory houses MongoDB-related definitions for the To-Do Tracker app.

## Models:
- **User**: 
    - `email` (unique, required)
    - `password` (hashed)
    - `createdAt` (auto-timestamp)
- **Task**:
    - `userId` (ObjectId ref to User, required)
    - `title` (required)
    - `description` (optional)
    - `category` (optional, for task categorization/filtering)
    - `dueDate` (optional, for due date reminders)
    - `isCompleted` (default: false)
    - `createdAt`, `updatedAt` (timestamps)

## MongoDB Connection
Use `connectToMongoDB(mongoUri, dbName)` from `models.js`
- Reads connection info from env vars (`MONGODB_URL`, `MONGODB_DB`).
- Ensures the backend connects to the appropriate MongoDB database for storing users and tasks.

## Usage
Import `User`, `Task`, and `connectToMongoDB` in your backend to interact with the database.

## Persistent Storage
All task and user data for the app is stored in MongoDB collections defined by these models and schemas.
