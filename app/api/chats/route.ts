import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 }
      );
    }

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          has: chatId,
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return NextResponse.json(chats[0]);
  } catch (error) {
    console.error("Failed to fetch chats:", error);

    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { participants } = await request.json();

    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        participants: {
          hasEvery: participants,
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (existingChat) {
      return NextResponse.json(existingChat);
    }

    // Create new chat if it doesn't exist
    const newChat = await prisma.chat.create({
      data: {
        participants: participants as string[],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!newChat) {
      return NextResponse.json(
        { error: "Failed to create chat" },
        { status: 500 }
      );
    }
    return NextResponse.json(newChat);
  } catch (error) {
    console.error("Failed to create chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
