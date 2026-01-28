import type { NextRequest } from "next/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatParticipants, chats, messages, users } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all chats where the user is a participant
    const userChats = await db
      .select({
        chat: chats,
        lastMessage: messages,
      })
      .from(chatParticipants)
      .where(eq(chatParticipants.userId, session.user.id))
      .leftJoin(chats, eq(chatParticipants.chatId, chats.id))
      .leftJoin(messages, and(eq(messages.chatId, chats.id)))
      .orderBy(desc(chats.updatedAt));

    // Filter out null chats and get chat IDs
    const validChats = userChats.filter(
      (uc): uc is typeof uc & { chat: NonNullable<typeof uc.chat> } =>
        uc.chat !== null,
    );
    const chatIds = validChats.map((uc) => uc.chat.id);

    if (chatIds.length === 0) {
      return NextResponse.json([]);
    }

    const participants = await db
      .select({
        chatId: chatParticipants.chatId,
        user: users,
      })
      .from(chatParticipants)
      .where(inArray(chatParticipants.chatId, chatIds))
      .leftJoin(users, eq(chatParticipants.userId, users.id));

    // Get last message for each chat
    const lastMessages = await db
      .select()
      .from(messages)
      .where(inArray(messages.chatId, chatIds))
      .orderBy(desc(messages.createdAt));

    // Group by chatId and get the latest message
    const lastMessagesByChat = lastMessages.reduce(
      (acc, msg) => {
        if (
          !acc[msg.chatId] ||
          new Date(msg.createdAt) > new Date(acc[msg.chatId].createdAt)
        ) {
          acc[msg.chatId] = msg;
        }
        return acc;
      },
      {} as Record<string, typeof messages.$inferSelect>,
    );

    // Organize data
    const chatsWithDetails = validChats.map((uc) => {
      const chatParticipantsList = participants
        .filter((p) => p.chatId === uc.chat.id)
        .map((p) => p.user);

      // For 1-on-1 chats, get the other user
      const otherUser = uc.chat.isGroup
        ? null
        : chatParticipantsList.find((p) => p && p.id !== session.user.id);

      return {
        ...uc.chat,
        participants: chatParticipantsList,
        otherUser,
        lastMessage: lastMessagesByChat[uc.chat.id] || null,
      };
    });

    return NextResponse.json(chatsWithDetails);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { participantIds, isGroup, name } = body;

    // Create chat
    const [newChat] = await db
      .insert(chats)
      .values({
        isGroup: isGroup || false,
        name: name || null,
      })
      .returning();

    // Add participants
    const participantEntries = [session.user.id, ...participantIds].map(
      (userId) => ({
        chatId: newChat.id,
        userId,
      }),
    );

    await db.insert(chatParticipants).values(participantEntries);

    return NextResponse.json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 },
    );
  }
}
