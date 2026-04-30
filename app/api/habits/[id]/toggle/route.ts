import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  const today = todayKey();

  // Fetch current completions
  const rows = await sql`
    SELECT completions FROM habits
    WHERE id = ${params.id} AND user_id = ${session.user.id}
    LIMIT 1
  `;
  if (!rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const completions: string[] = (rows[0].completions as string[]) ?? [];
  const has = completions.includes(today);

  if (has) {
    // Remove today
    await sql`
      UPDATE habits
      SET completions = array_remove(completions, ${today})
      WHERE id = ${params.id} AND user_id = ${session.user.id}
    `;
  } else {
    // Add today
    await sql`
      UPDATE habits
      SET completions = array_append(completions, ${today})
      WHERE id = ${params.id} AND user_id = ${session.user.id}
    `;
  }

  return NextResponse.json({ ok: true, toggled: !has });
}
