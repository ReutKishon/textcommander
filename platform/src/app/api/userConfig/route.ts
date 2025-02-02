import { eq } from "drizzle-orm";
import { getDb } from "../../../../../lib/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const userId = searchParams.get("userId");
    console.log("userId:", userId);
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: userId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const db = await getDb();
    const userConfig = await db.query.userConfigTable.findFirst({
      where: (userConfigTable, { eq }) => eq(userConfigTable.user_id, userId),
    });

    console.log("Query result:", userConfig);

    if (!userConfig) {
      return new Response(
        JSON.stringify({
          error: `User config not found for userId: ${userId}`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        is_initialized: userConfig.is_initialized,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to fetch user config:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
