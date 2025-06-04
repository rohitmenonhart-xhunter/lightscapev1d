/**
 * Script to create a test user for authentication testing
 * Run with: node scripts/create-test-user.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Extract database name from connection string or use default
function getDatabaseName(uri) {
  if (!uri) return 'test';
  
  try {
    // Extract database name from URI if possible
    const dbNameMatch = uri.match(/\/([^/?]+)(\?|$)/);
    return dbNameMatch ? dbNameMatch[1] : 'test';
  } catch (error) {
    console.warn('Could not parse database name from URI, using default');
    return 'test';
  }
}

const DB_NAME = getDatabaseName(MONGODB_URI);
console.log(`Using database: ${DB_NAME}`);

async function createTestUser() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable not set');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    // Check if test user already exists
    const existingUser = await usersCollection.findOne({ email: 'test@stello.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const testUser = {
      name: 'Test User',
      email: 'test@stello.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(testUser);
    console.log(`Test user created with ID: ${result.insertedId}`);

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

createTestUser().catch(console.error); 