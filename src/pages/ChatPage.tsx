import { useState, useRef, useEffect } from 'preact/hooks';
import { useChat } from '../hooks/useChat';
import { ChatBubble } from '../components/ChatBubble';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { mockUsers } from '../data/mockData';

const ME = 'u1';

function getUserName(id: string) {
  return mockUsers.find((u) => u.id === id)?.callsign ?? id;
}

export function ChatPage() {
  const { chats, activeChatId, setActiveChatId, messages, sendMessage, loading } = useChat(ME);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div class="flex h-full pb-16 md:pb-0 overflow-hidden">
      {/* Sidebar */}
      <div class="w-20 md:w-64 bg-slate-900 border-r border-slate-700 flex flex-col overflow-y-auto">
        <div class="p-3 border-b border-slate-700">
          <span class="text-slate-400 text-xs uppercase tracking-wider hidden md:block">Channels</span>
        </div>
        {loading ? (
          <div class="p-3"><Skeleton lines={3} /></div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              class={`flex items-center gap-3 p-3 text-left transition-colors ${
                activeChatId === chat.id ? 'bg-emerald-900/30 border-r-2 border-emerald-500' : 'hover:bg-slate-800'
              }`}
            >
              <Avatar name={chat.name} size="sm" />
              <div class="hidden md:block min-w-0">
                <p class="text-slate-200 text-sm font-medium truncate">{chat.name}</p>
                <Badge label={chat.type} color={chat.type === 'group' ? 'blue' : 'slate'} />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Message area */}
      <div class="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div class="p-4 border-b border-slate-700 flex items-center gap-3">
          {activeChatId && (
            <>
              <Avatar name={chats.find((c) => c.id === activeChatId)?.name ?? ''} />
              <span class="text-white font-semibold">{chats.find((c) => c.id === activeChatId)?.name}</span>
            </>
          )}
        </div>

        {/* Messages */}
        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {loading ? (
            <Skeleton lines={5} class="h-10 w-3/4" />
          ) : (
            messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isMine={msg.senderId === ME}
                senderName={getUserName(msg.senderId)}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div class="p-3 border-t border-slate-700 flex gap-2">
          <input
            type="text"
            value={draft}
            onInput={(e) => setDraft((e.target as HTMLInputElement).value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            class="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <Button onClick={handleSend} disabled={!draft.trim()}>Send</Button>
        </div>
      </div>
    </div>
  );
}
