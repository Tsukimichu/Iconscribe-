import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { MessageCircle } from "lucide-react";
import { API_URL } from "../api";
import { SOCKET_URL } from "../api";

  const socket = io(SOCKET_URL, {
    withCredentials: true,
  });

function ChatWidget({ userId = 1, managerId = 999 }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  // Create or get conversation from backend
    useEffect(() => {
    // Initialize conversation
    const initConversation = async () => {
        try {
        const res = await axios.post(`${API_URL}/chat/conversations`, {
            clientId: userId,
            managerId,
        });
        setConversationId(res.data.id);

        // Load messages from DB
       const msgRes = await axios.get(`${API_URL}/chat/messages/${res.data.id}`);
        const formattedMessages = msgRes.data.map((msg) => ({
        ...msg,
        time: new Date(msg.createdAt).toLocaleString(),
        }));
        setMessages(formattedMessages);


        // Join Socket.IO room
        socket.emit("joinRoom", res.data.id);
        } catch (err) {
        console.error("Error initializing chat:", err);
        }
    };

    initConversation();
    }, [userId, managerId]); 


  // Send message to backend + socket
  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    const msg = {
      conversationId,
      senderId: userId,
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    try {
      await axios.post(`${API_URL}/chat/messages`, msg);
      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="w-80 h-96 bg-white rounded-xl shadow-lg flex flex-col">
          <div className="flex justify-between items-center p-3 border-b bg-blue-500 text-white rounded-t-xl">
            <h3 className="font-semibold">Chat with ICONscribe</h3>
            <button onClick={() => setOpen(false)} className="text-white text-xl leading-none">
              ×
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-gray-400 text-center mt-10 text-sm">
                Start a conversation...
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.senderId === userId
                    ? "bg-blue-100 ml-auto text-right"
                    : "bg-gray-200 mr-auto text-left"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="flex border-t p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-l-lg px-3 py-1 outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg"
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
