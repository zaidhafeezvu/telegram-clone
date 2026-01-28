import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chats, messages, users } from "@/lib/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId } = await params;

  try {
    const chatMessages = await db
      .select({
        message: messages,
        sender: users,
      })
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .leftJoin(users, eq(messages.senderId, users.id))
      .orderBy(messages.createdAt);

    const formattedMessages = chatMessages.map((m) => ({
      ...m.message,
      sender: m.sender,
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId } = await params;

  try {
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 },
      );
    }

    // Create message
    const [newMessage] = await db
      .insert(messages)
      .values({
        chatId,
        senderId: session.user.id,
        content: content.trim(),
      })
      .returning();

    // Update chat's updatedAt timestamp
    await db
      .update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, chatId));

    // Fetch sender info
    const [sender] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ ...newMessage, sender });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
