import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { v4 as uuidv4 } from "uuid";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the prompt for floor plan generation
const FLOOR_PLAN_PROMPT = `
Enhance this floor plan with professional styling while maintaining EXACTLY the same layout, dimensions, and structure.
Important: Do NOT add, remove, or relocate any walls, doors, windows, or structural elements.
Do NOT change the room sizes, shapes, or positions.

First, intelligently identify each room type based on the floor plan (bedroom, bathroom, kitchen, living room, etc.).
Then, add appropriate furniture and fixtures for each identified room type, but keep the furniture VERY MINIMAL and EXTREMELY SMALL in scale:
- Bedrooms: Add tiny beds, minimal nightstands
- Bathrooms: Add simple toilets, small sinks
- Kitchens: Add basic countertops, minimal appliances
- Living rooms: Add simple sofas, tiny coffee tables
- Dining areas: Add small dining tables and chairs
- Home offices: Add small desks

Apply a clean, modern architectural blueprint style with:
- Dark monochromatic blue background
- Crisp white outlines for walls and structures
- Subtle shadows for depth
- Clean, professional labeling for each room type

HIGHEST PRIORITY: The entire floor plan MUST be significantly SCALED DOWN to fit perfectly within the canvas. Scale the floor plan to be 70% of the canvas size to ensure nothing is cut off. Center the floor plan in the image and ensure all room labels are clearly visible. Maintain a minimum 15% margin around all edges of the floor plan. ZOOM OUT enough to show the entire floor plan with plenty of space around it.

The result should look like a professional architectural blueprint with the EXACT SAME layout as the uploaded floor plan but with minimal furniture added to each room based on its detected function, all properly scaled to fit entirely within the canvas with significant margins on all sides.
`;

export async function POST(req: NextRequest) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const aspectRatio = formData.get("aspectRatio") as string || "landscape"; // Default to landscape if not specified

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // Convert the uploaded file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a base64 representation of the original image
    const originalBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    // Convert the buffer to OpenAI-compatible format
    const fileName = `${uuidv4()}-${file.name}`;
    const imageFile = await toFile(buffer, fileName, { type: file.type });

    // Determine the size parameter based on the requested aspect ratio
    // Using only allowed values from the OpenAI API
    let size: "1024x1024" | "1024x1536" | "1536x1024" = "1024x1024"; // Default square
    if (aspectRatio === "landscape") {
      size = "1536x1024"; // Landscape
    } else if (aspectRatio === "portrait") {
      size = "1024x1536"; // Portrait
    }

    // Use gpt-image-1 for image editing with the specified size
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: FLOOR_PLAN_PROMPT,
      size: size,
    });

    // Check if response data exists
    if (!response.data || response.data.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate floor plan" },
        { status: 500 }
      );
    }

    // Get the base64 image data
    const base64Image = response.data[0].b64_json;
    
    if (!base64Image) {
      return NextResponse.json(
        { error: "No image data received from OpenAI" },
        { status: 500 }
      );
    }

    // Create a data URL for the generated image
    const generatedBase64 = `data:image/png;base64,${base64Image}`;

    // Return the response with the original and generated images as base64
    return NextResponse.json({
      success: true,
      originalImage: originalBase64,
      generatedImage: generatedBase64,
      aspectRatio: aspectRatio,
    });
  } catch (error: any) {
    console.error("Error generating floor plan:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process the floor plan" },
      { status: 500 }
    );
  }
} 