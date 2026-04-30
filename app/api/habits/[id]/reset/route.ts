import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  await sql`
    UPDATE habits
    SET completions = ARRAY[]::TEXT[]
    WHERE id = ${params.id} AND user_id = ${session.user.id}
  `;

  return NextResponse.json({ ok: true });
}
