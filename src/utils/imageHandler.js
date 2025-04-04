import fs from "fs";
import path from "path";

const IMAGE_DIRECTORIES = {
  user: path.join(process.cwd(), "images/users"),
  hotel_itself: path.join(process.cwd(), "images/hotel/itself"),
  hotel_logo: path.join(process.cwd(), "images/hotel/logo"),
  hotel_room: path.join(process.cwd(), "images/hotel/room"),
};

// Function to handle image upload (no HTTP request, just file processing)
export async function handleImageUpload(file, type, entityId) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!IMAGE_DIRECTORIES[type]) {
      throw new Error(`Invalid image type: ${type}`);
    }

    // Ensure the directory exists
    const directory = IMAGE_DIRECTORIES[type];
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Define the file path
    const filePath = path.join(directory, `${entityId}.png`);

    // Convert file to buffer and save it
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);

    return {
      status: 200,
      message: "Image uploaded successfully",
      filePath: `/${type}/${entityId}.png`,
    };
  } catch (error) {
    console.error("❌ Error in handleImageUpload:", error);
    return {
      status: 500,
      message: "Error processing image",
      error: error.message,
    };
  }
}