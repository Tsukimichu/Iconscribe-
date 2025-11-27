import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Send, MessageSquare, CheckCheck, UserCircle } from "lucide-react";
import { API_URL, SOCKET_URL } from "../../api";

const socket = io(SOCKET_URL);

function ManagerChatPanel({ managerId = 10 }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [seenMessageId, setSeenMessageId] = useState(null);

  const messagesEndRef = useRef(null);
  const selectedConversationRef = useRef(selectedConversation);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/chat/conversations/${managerId}`
        );
        setConversations(res.data);
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    };
    fetchConversations();
  }, [managerId]);

  // Load messages on conversation change
  useEffect(() => {
    if (!selectedConversation) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/chat/messages/${selectedConversation.id}`
        );

        const formatted = res.data.map((msg) => ({
          ...msg,
          time: new Date(msg.createdAt || msg.time).toLocaleString(),
        }));

        setMessages(formatted);

        // Join room
        socket.emit("joinRoom", selectedConversation.id);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // Socket listeners: receive + seen
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log("Message received:", msg);

      // ❌ Prevent duplicate manager messages
      if (msg.senderId === managerId) {
        return; // ignore echo of manager's own message
      }

      // Update conversations list
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === msg.conversationId);
        if (exists) {
          return prev.map((c) =>
            c.id === msg.conversationId ? { ...c, lastMessage: msg.text } : c
          );
        } else {
          return [
            ...prev,
            {
              id: msg.conversationId,
              clientId: msg.senderId,
              lastMessage: msg.text,
            },
          ];
        }
      });

      // If this conversation is open, add message
      if (selectedConversationRef.current?.id === msg.conversationId) {
        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            time: new Date(msg.createdAt || msg.time).toLocaleString(),
          },
        ]);
      }
    };


    const handleMessageSeen = (payload) => {
      // { conversationId, messageId, seenBy }
      if (selectedConversationRef.current?.id === payload.conversationId) {
        setSeenMessageId(payload.messageId);
      }
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("messageSeen", handleMessageSeen);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("messageSeen", handleMessageSeen);
    };
  }, []);

  // Send typing from manager (for client typing indicator)
  const emitTyping = () => {
    if (!selectedConversation) return;
    socket.emit("typing", {
      conversationId: selectedConversation.id,
      senderId: managerId,
      from: "manager",
    });
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation) return;

    const msg = {
      conversationId: selectedConversation.id,
      senderId: managerId,
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
      setSeenMessageId(null); // will be updated when client sees it
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* SIDEBAR */}
      <div className="w-72 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border-gray-200 flex flex-col">
        <div className="flex rounded-t-lg items-center gap-2 px-5 py-4 border-b border-b-gray-200 bg-blue-100/70">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
            <MessageSquare size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-blue-800">
              Support Inbox
            </span>
            <span className="text-[11px] text-blue-500">
              {conversations.length} active conversation
              {conversations.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              onClick={() => {
                setSelectedConversation(conv);
                setSeenMessageId(null);
              }}
              className={`px-4 py-3 border-b border-b-gray-200 cursor-pointer transition-all flex flex-col gap-1 ${
                selectedConversation?.id === conv.id
                  ? "bg-blue-50 text-blue-800"
                  : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {conv.clientName || `Client #${conv.clientId}`}
                </span>
                <span className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <p className="text-xs text-gray-500 truncate">
                {conv.lastMessage || "No messages yet"}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col m-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl overflow-hidden border border-gray-200">
        {!selectedConversation ? (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
            Select a conversation to start chatting 💬
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-3 shadow-md">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <UserCircle size={22} className="text-yellow-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {selectedConversation.clientName ||
                    `Client #${selectedConversation.clientId}`}
                </span>
                <span className="text-[11px] text-blue-100">
                  Customer chat • Online
                </span>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => {
                const isManager = msg.senderId === managerId;
                const isSeen = isManager && msg.id === seenMessageId;

                return (
                  <div
                    key={i}
                    className={`flex ${
                      isManager ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-2xl shadow-sm text-sm ${
                        isManager
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] opacity-80">
                          {msg.time}
                        </span>
                        {isSeen && (
                          <span className="flex items-center gap-1 text-[10px] text-yellow-200">
                            <CheckCheck size={11} /> Seen
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="flex items-center gap-2 border-t bg-white px-4 py-3">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  emitTyping();
                }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
              />
              <button
                onClick={sendMessage}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ManagerChatPanel;