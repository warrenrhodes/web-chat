import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const searchTerm = searchParams.get("q");

    if (!chatId || !searchTerm) {
      return NextResponse.json(
        { error: "Chat ID and search term are required" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId,
        text: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search messages" },
      { status: 500 }
    );
  }
}
