import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatParticipants, chats, messages, users } from "@/lib/db/schema";

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
		// Verify user is a participant of this chat
		const participant = await db
			.select()
			.from(chatParticipants)
			.where(
				and(
					eq(chatParticipants.chatId, chatId),
					eq(chatParticipants.userId, session.user.id),
				),
			)
			.limit(1);

		if (participant.length === 0) {
			return NextResponse.json(
				{ error: "Forbidden - not a participant" },
				{ status: 403 },
			);
		}

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
		// Verify user is a participant of this chat
		const participant = await db
			.select()
			.from(chatParticipants)
			.where(
				and(
					eq(chatParticipants.chatId, chatId),
					eq(chatParticipants.userId, session.user.id),
				),
			)
			.limit(1);

		if (participant.length === 0) {
			return NextResponse.json(
				{ error: "Forbidden - not a participant" },
				{ status: 403 },
			);
		}

		const body = await request.json();
		const { content } = body;

		if (!content || content.trim() === "") {
			return NextResponse.json(
				{ error: "Message content is required" },
				{ status: 400 },
			);
		}

		// Limit message length
		const trimmedContent = content.trim();
		if (trimmedContent.length > 5000) {
			return NextResponse.json(
				{ error: "Message too long (max 5000 characters)" },
				{ status: 400 },
			);
		}

		// Create message
		const [newMessage] = await db
			.insert(messages)
			.values({
				chatId,
				senderId: session.user.id,
				content: trimmedContent,
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
