import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-setup-secret");
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sql = getDb();

  // Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      emoji TEXT NOT NULL DEFAULT '✨',
      completions TEXT[] DEFAULT ARRAY[]::TEXT[],
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Create admin user if not exists
  const existing = await sql`
    SELECT id FROM users WHERE email = 'archi.gud@gmail.com' LIMIT 1
  `;

  if (!existing.length) {
    const hash = await bcrypt.hash("Password123", 12);
    await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES ('archi.gud@gmail.com', ${hash}, 'Admin')
    `;
  }

  return NextResponse.json({ ok: true, message: "Setup complete" });
}
