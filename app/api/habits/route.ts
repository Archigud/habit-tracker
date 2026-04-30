import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT id, name, emoji, completions, created_at
    FROM habits
    WHERE user_id = ${session.user.id}
    ORDER BY created_at DESC
  `;

  const habits = rows.map((r) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    completions: (r.completions as string[]) ?? [],
    createdAt: r.created_at,
  }));

  return NextResponse.json(habits);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, emoji } = await req.json();
  if (!id || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const sql = getDb();
  await sql`
    INSERT INTO habits (id, user_id, name, emoji, completions)
    VALUES (${id}, ${session.user.id}, ${name}, ${emoji ?? "✨"}, ARRAY[]::TEXT[])
    ON CONFLICT (id) DO NOTHING
  `;

  return NextResponse.json({ ok: true });
}
