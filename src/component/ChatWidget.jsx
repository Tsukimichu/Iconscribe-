import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { MessageCircle, UserCircle } from "lucide-react";
import { API_URL, SOCKET_URL } from "../api";

const socket = io(SOCKET_URL, {
  withCredentials: true,
});

function ChatWidget({ userId = 1, managerId = 10 }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(false);

  // -----------------------------
  // INIT CONVERSATION
  // -----------------------------
  useEffect(() => {
    const initConversation = async () => {
      try {
        const res = await axios.post(`${API_URL}/chat/conversations`, {
          clientId: userId,
          managerId,
        });

        setConversationId(res.data.id);

        // Load previous messages
        const msgRes = await axios.get(
          `${API_URL}/chat/messages/${res.data.id}`
        );
        const formattedMessages = msgRes.data.map((msg) => ({
          ...msg,
          time: new Date(msg.createdAt || msg.time).toLocaleString(),
        }));

        setMessages(formattedMessages);

        // Join room
        socket.emit("joinRoom", res.data.id);
      } catch (err) {
        console.error("Error initializing chat:", err);
      }
    };

    initConversation();
  }, [userId, managerId]);

  // -----------------------------
  // SOCKET LISTENERS
  // -----------------------------
  useEffect(() => {
    const handleReceive = (msg) => {
      // Prevent duplicate of my own sent message
      if (msg.senderId === userId) return;

      const formatted = {
        ...msg,
        time: new Date(msg.createdAt || msg.time).toLocaleString(),
      };

      setMessages((prev) => [...prev, formatted]);

      // Mark unread if window is closed
      if (!open) {
        setUnread(true);
      }
    };

    const handleTyping = (payload) => {
      // We only care when manager is typing in this conversation
      if (payload.conversationId === conversationId) {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500);
      }
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
    };
  }, [open, conversationId]);

  // -----------------------------
  // SEND "TYPING" EVENT
  // -----------------------------
  const handleTyping = () => {
    if (!conversationId) return;
    socket.emit("typing", { conversationId, senderId: userId, from: "client" });
  };

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    const msg = {
      conversationId,
      senderId: userId,
      text: input.trim(),
    };

    try {
      const res = await axios.post(`${API_URL}/chat/messages`, msg);
      const messageWithTime = {
        ...res.data,
        time: new Date().toLocaleString(),
      };

      socket.emit("sendMessage", messageWithTime);
      setMessages((prev) => [...prev, messageWithTime]);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button (Closed State) */}
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            setUnread(false);
          }}
          className="relative flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-transform hover:scale-105"
        >
          <MessageCircle size={24} />
          {unread && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full shadow-md" />
          )}
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex items-center gap-3 px-3 py-2 bg-blue-600 text-white">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
              <UserCircle size={22} className="text-yellow-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">ICONScribe Support</span>
              <span className="text-xs text-blue-100">Typically replies within a few minutes</span>
            </div>
            <button
              className="ml-auto text-white text-xl leading-none hover:opacity-80"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-3 py-2 overflow-y-auto bg-gray-50 space-y-2">
            {messages.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-6">
                Start a conversation with us 👋
              </p>
            )}

            {messages.map((msg, i) => {
              const isMe = msg.senderId === userId;
              return (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar for manager messages */}
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircle size={18} className="text-gray-500" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs shadow-sm ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                    <span className="text-[10px] opacity-70 block mt-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {typing && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserCircle size={16} className="text-gray-500" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-300" />
                </div>
                <span>Typing…</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-white px-2 py-2 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 text-xs px-3 py-2 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            <button
              onClick={sendMessage}
              className="px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;