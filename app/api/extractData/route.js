import { getDataFromToken } from "@/helper/getDataFromToken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import connect from "@/lib/mongodb";
import User from "@/lib/models/User";

connect();
export async function GET(request) {
  try {
    const userID = await getDataFromToken(request);
    const user = await User.findById({ _id: userID }).select("-password");
    return NextResponse.json(
      { message: "User found", data: user },
      {
        status: 200,
        success: true,
      }
    );
  } catch {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
