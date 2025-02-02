import { NextRequest } from "next/server";
import {
  getTrackedFriends,
  trackedFriend,
  untrackFriend,
} from "../../../../../lib/repositories/tracked-friends.repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: userId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const trackedFriends = await getTrackedFriends(userId);
    return new Response(JSON.stringify(trackedFriends), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user contacts." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, friendId, friendName } = await req.json();

    if (!userId || !friendId) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: userId or friendId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await trackedFriend(userId, friendId, friendName);
    return new Response("", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to track friend." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const friendId = searchParams.get("friendId");
    if (!userId || !friendId) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: userId or friendId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await untrackFriend(userId, friendId);
    return new Response("", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to untrack friend." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
