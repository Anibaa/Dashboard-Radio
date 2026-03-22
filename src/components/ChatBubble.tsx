import type { Message } from '../types';

interface Props {
  message: Message;
  isMine: boolean;
  senderName: string;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatBubble({ message, isMine, senderName }: Props) {
  return (
    <div class={`flex flex-col max-w-xs ${isMine ? 'items-end self-end' : 'items-start self-start'}`}>
      {!isMine && <span class="text-xs text-slate-400 mb-1 ml-1">{senderName}</span>}
      <div class={`rounded-2xl px-4 py-2 text-sm ${isMine ? 'bg-emerald-700 text-white rounded-br-sm' : 'bg-slate-700 text-slate-100 rounded-bl-sm'}`}>
        {message.type === 'image' ? (
          <img src={message.content} alt="media" class="rounded-lg max-w-full max-h-48 object-cover" />
        ) : (
          <p>{message.content}</p>
        )}
      </div>
      <span class="text-xs text-slate-500 mt-1">{formatTime(message.timestamp)}</span>
    </div>
  );
}
