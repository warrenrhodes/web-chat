import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { chatId, lastMessageId } = await request.json();
    const batchSize = 20;

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId,
        // ...(lastMessageId && {
        //   id: { gt: lastMessageId },
        // }),
      },
      orderBy: {
        id: "asc",
      },
      take: batchSize,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
