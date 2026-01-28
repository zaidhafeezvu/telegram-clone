import type { NextRequest } from "next/server";
import { ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users except the current user (without password)
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        bio: users.bio,
        isOnline: users.isOnline,
        lastSeen: users.lastSeen,
      })
      .from(users)
      .where(ne(users.id, session.user.id));

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
