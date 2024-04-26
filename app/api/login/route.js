"use server";
import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { ComparePasswords } from "@/utils/managePassword";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connect();

  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await ComparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    //create token data
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    //create token
    const token = jwt.sign(tokenData, process.env.Token_Secret, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({ message: "Login successful" }, user, {
      status: 200,
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error) {
    console.error("Login error:", error.message);
    return NextResponse.json(
      { message: "something went wrong", error: error.message },
      {
        status: 401,
        success: false,
      }
    );
  }
}
