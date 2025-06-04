import { NextResponse } from 'next/server';
import { hash } from "bcryptjs";
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Create a test user
    const hashedPassword = await hash("testpassword123", 12);
    const testUser = {
      name: "Test User",
      email: "test@stello.com",
      password: hashedPassword
    };
    
    // Check if user exists
    const existingUser = await User.findOne({ email: testUser.email });
    
    if (existingUser) {
      return NextResponse.json({
        status: 'success',
        message: 'Test user already exists',
        user: {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email
        }
      });
    }
    
    // Try to create a user
    try {
      const user = await User.create(testUser);
      
      return NextResponse.json({
        status: 'success',
        message: 'Test user created successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        }
      });
    } catch (createError) {
      console.error('Error creating test user:', createError);
      
      return NextResponse.json({
        status: 'error',
        message: 'Failed to create test user',
        error: createError instanceof Error ? createError.message : String(createError),
        stack: createError instanceof Error ? createError.stack : undefined
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test user endpoint error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test user creation',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 