import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { encrypt } from "@/utils/crypto";

export async function PATCH(request) {
  await connect();

  const { userId, name, email, gender } = await request.json();

  try {
    // Find the user by userId
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json("User not found", {
        status: 404,
        success: false,
      });
    }

    // Update user fields if provided
    if (name) existingUser.name = encrypt(name);
    if (email) existingUser.email = email;
    if (gender) existingUser.gender = encrypt(gender);

    // Save the updated user
    await existingUser.save();

    return NextResponse.json("User updated successfully", {
      status: 200,
      success: true,
    });
  } catch (error) {
    return NextResponse.json("Internal Server Error", {
      status: 500,
      success: false,
      error: error.message,
    });
  }
}

export async function POST(request) {
  await connect();

  const { _id, title, content } = await request.json();

  try {
    // Find the user by userId
    const existingUser = await User.findById(_id);
    if (!existingUser) {
      console.log("user not found");
      return NextResponse.json("User not found", {
        status: 404,
        success: false,
      });
    }

    // Encrypt the title and content
    const encryptedTitle = encrypt(title);
    const encryptedContent = encrypt(content);

    // Add new post
    existingUser.posts.push({
      title: encryptedTitle,
      content: encryptedContent,
    });

    // Save the updated user
    await existingUser.save();

    return NextResponse.json("New post added successfully", {
      status: 200,
      success: true,
    });
  } catch (error) {
    return NextResponse.json("Internal Server Error", {
      status: 500,
      success: false,
      error: error.message,
    });
  }
}

// export async function GET(request) {
//   try {
//     const userID = await getDataFromToken(request);
//     const user = await User.findById({ _id: userID }).select("-password");
//     return NextResponse.json(
//       { message: "User found", data: user },
//       {
//         status: 200,
//         success: true,
//       }
//     );
//   } catch {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }
