"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth/client";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import NewChatModal from "@/components/NewChatModal";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isChatListOpen, setIsChatListOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Sidebar with chat list */}
      <div className={`${isChatListOpen ? 'fixed inset-0 z-40' : 'hidden'} md:flex md:relative md:inset-auto w-full md:w-96 border-r border-gray-200 dark:border-gray-700 flex-col bg-white dark:bg-gray-900`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600">
          <div className="flex items-center">
            <button
              onClick={() => setIsChatListOpen(false)}
              className="md:hidden p-2 mr-2 rounded-full hover:bg-blue-700 transition"
              title="Close menu"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Telegram</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-white text-sm font-medium">
              {session.user.name}
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-full hover:bg-blue-700 transition"
              title="Sign out"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-hidden">
          <ChatList
            onChatSelect={(chatId) => {
              setSelectedChatId(chatId);
              setIsChatListOpen(false);
            }}
            selectedChatId={selectedChatId}
            onNewChat={() => setIsNewChatModalOpen(true)}
          />
        </div>
      </div>

      {/* Main chat window */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with hamburger menu */}
        <div className="md:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600">
          <button
            onClick={() => setIsChatListOpen(true)}
            className="p-2 rounded-full hover:bg-blue-700 transition"
            title="Open menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="ml-3 text-xl font-bold text-white">Telegram</h1>
        </div>
        
        <ChatWindow chatId={selectedChatId} currentUserId={session.user.id} />
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onChatCreated={(chatId) => setSelectedChatId(chatId)}
      />
    </div>
  );
}
