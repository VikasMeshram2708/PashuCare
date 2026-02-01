"use server";

import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

export async function fetchChats() {
  try {
    // auth check
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const chatsRow = await fetchQuery(api.chats.getAllChats, {
      userId: userId,
    });

    return {
      success: true,
      message: "Chats fetched",
      metadata: {
        data: chatsRow,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
