import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate email domain
    const allowedDomains = ["stello.com", "lightscape.com"];
    const emailDomain = email.split("@")[1];
    
    if (!emailDomain || !allowedDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: "Email domain not allowed. Please use an email from stello.com or lightscape.com" },
        { status: 403 }
      );
    }

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { 
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500 }
      );
    }

    // Check if user already exists
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
    } catch (findError) {
      console.error("Error checking existing user:", findError);
      return NextResponse.json(
        { 
          error: "Error checking user existence",
          details: findError instanceof Error ? findError.message : String(findError)
        },
        { status: 500 }
      );
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await hash(password, 12);
    } catch (hashError) {
      console.error("Password hashing error:", hashError);
      return NextResponse.json(
        { 
          error: "Error processing password",
          details: hashError instanceof Error ? hashError.message : String(hashError)
        },
        { status: 500 }
      );
    }

    // Create new user
    try {
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      });

      // Return success without sending the password
      const newUser = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      return NextResponse.json(
        { message: "User registered successfully", user: newUser },
        { status: 201 }
      );
    } catch (createError) {
      console.error("Error creating user:", createError);
      return NextResponse.json(
        { 
          error: "Failed to create user",
          details: createError instanceof Error ? createError.message : String(createError),
          code: createError instanceof Error && 'code' in createError ? (createError as any).code : 'UNKNOWN'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { 
        error: "An error occurred during registration",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 