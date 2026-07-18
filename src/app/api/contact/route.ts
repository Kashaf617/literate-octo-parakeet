import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        message,
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to save message. Please try again later." },
      { status: 500 }
    );
  }
}
