import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Try to connect to the database
    await connectToDatabase();
    
    // Get connection status
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized',
    };
    
    // Get database information
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    
    return NextResponse.json({
      status: 'success',
      message: 'Connected to MongoDB successfully',
      connection: {
        state: connectionStates[connectionState] || 'unknown',
        database: dbName,
        host: dbHost,
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 