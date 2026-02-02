"use client";

import { useUser } from "@clerk/nextjs";
import ChatInput from "./components/chat-input";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "motion/react";

export default function ChatPage() {
  const { user } = useUser();

  const text = `Welcome ${user?.firstName ?? user?.fullName ?? "Pet Parent"}`;

  return (
    <div className="relative flex h-[90dvh] flex-col bg-background">
      {/* Empty / welcome state */}
      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
          <LayoutTextFlip
            text={text}
            words={[
              "PashuCare AI",
              "Pet Health Assistant",
              "Animal Care Expert",
              "Trusted Vet Guidance",
              "Care for Every Life",
            ]}
          />
        </motion.div>
      </div>

      {/* Input (sticky bottom) */}
      <ChatInput />
    </div>
  );
}
