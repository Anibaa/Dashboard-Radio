import { useState, useEffect, useCallback } from 'preact/hooks';
import { api } from '../services/api';
import type { Chat, Message } from '../types';

export function useChat(currentUserId = 'u1') {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.chat.getChats()
      .then((data) => { setChats(data); setActiveChatId(data[0]?.id ?? null); })
      .catch(() => setError('Failed to load chats'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    api.chat.getMessages(activeChatId).then(setMessages);
  }, [activeChatId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!activeChatId) return;
    const msg = await api.chat.sendMessage({
      senderId: currentUserId,
      chatId: activeChatId,
      type: 'text',
      content,
    });
    setMessages((prev) => [...prev, msg]);
  }, [activeChatId, currentUserId]);

  return { chats, activeChatId, setActiveChatId, messages, sendMessage, loading, error };
}
