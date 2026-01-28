import { db } from "./lib/db";
import { users, chats, chatParticipants, messages } from "./lib/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
	console.log("Seeding database...");

	// Create demo users
	const password = await bcrypt.hash("password123", 10);

	const [user1, user2, user3] = await db
		.insert(users)
		.values([
			{
				email: "alice@example.com",
				name: "Alice Johnson",
				password,
				bio: "Software developer and tech enthusiast",
				isOnline: true,
			},
			{
				email: "bob@example.com",
				name: "Bob Smith",
				password,
				bio: "Designer and creative thinker",
				isOnline: false,
			},
			{
				email: "charlie@example.com",
				name: "Charlie Brown",
				password,
				bio: "Product manager and problem solver",
				isOnline: true,
			},
		])
		.returning();

	console.log("Created demo users");

	// Create a chat between Alice and Bob
	const [chat1] = await db
		.insert(chats)
		.values({
			isGroup: false,
		})
		.returning();

	await db.insert(chatParticipants).values([
		{ chatId: chat1.id, userId: user1.id },
		{ chatId: chat1.id, userId: user2.id },
	]);

	// Add some messages to the chat
	await db.insert(messages).values([
		{
			chatId: chat1.id,
			senderId: user1.id,
			content: "Hey Bob! How are you?",
		},
		{
			chatId: chat1.id,
			senderId: user2.id,
			content: "Hi Alice! I'm doing great, thanks for asking!",
		},
		{
			chatId: chat1.id,
			senderId: user1.id,
			content: "That's wonderful! Want to grab coffee later?",
		},
		{
			chatId: chat1.id,
			senderId: user2.id,
			content: "Sure! How about 3 PM at the usual place?",
		},
	]);

	console.log("Created chat between Alice and Bob");

	// Create a chat between Alice and Charlie
	const [chat2] = await db
		.insert(chats)
		.values({
			isGroup: false,
		})
		.returning();

	await db.insert(chatParticipants).values([
		{ chatId: chat2.id, userId: user1.id },
		{ chatId: chat2.id, userId: user3.id },
	]);

	await db.insert(messages).values([
		{
			chatId: chat2.id,
			senderId: user3.id,
			content: "Alice, did you see the latest project updates?",
		},
		{
			chatId: chat2.id,
			senderId: user1.id,
			content: "Yes! They look amazing. Great work!",
		},
	]);

	console.log("Created chat between Alice and Charlie");

	// Create a group chat
	const [groupChat] = await db
		.insert(chats)
		.values({
			name: "Team Discussion",
			isGroup: true,
		})
		.returning();

	await db.insert(chatParticipants).values([
		{ chatId: groupChat.id, userId: user1.id },
		{ chatId: groupChat.id, userId: user2.id },
		{ chatId: groupChat.id, userId: user3.id },
	]);

	await db.insert(messages).values([
		{
			chatId: groupChat.id,
			senderId: user1.id,
			content: "Welcome everyone to the team chat!",
		},
		{
			chatId: groupChat.id,
			senderId: user2.id,
			content: "Thanks for setting this up, Alice!",
		},
		{
			chatId: groupChat.id,
			senderId: user3.id,
			content: "Great idea! This will make communication easier.",
		},
	]);

	console.log("Created group chat");

	console.log("\n✅ Database seeded successfully!");
	console.log("\nDemo accounts:");
	console.log("- alice@example.com / password123");
	console.log("- bob@example.com / password123");
	console.log("- charlie@example.com / password123");

	process.exit(0);
}

seed().catch((error) => {
	console.error("Error seeding database:", error);
	process.exit(1);
});
