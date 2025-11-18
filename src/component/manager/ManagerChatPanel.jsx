import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Send, MessageSquare } from "lucide-react";
import { API_URL } from "../../api";

const socket = io("http://72.61.143.130:5000"); 

function ManagerChatPanel({ managerId = 10 }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const selectedConversationRef = useRef(selectedConversation);
  useEffect(() => { selectedConversationRef.current = selectedConversation; }, [selectedConversation]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/conversations/${managerId}`);
        setConversations(res.data);
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    };
    fetchConversations();
  }, [managerId]);

  // Load messages when a conversation changes
  useEffect(() => {
    if (!selectedConversation) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/chat/messages/${selectedConversation.id}`
        );

        const formatted = res.data.map(msg => ({
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

  // Socket listener for all messages
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log("Message received:", msg);

      // Update conversation list
      setConversations(prev => {
        const convExists = prev.find(c => c.id === msg.conversationId);
        if (convExists) {
          return prev.map(c =>
            c.id === msg.conversationId ? { ...c, lastMessage: msg.text } : c
          );
        } else {
          return [...prev, { id: msg.conversationId, clientId: msg.senderId, lastMessage: msg.text }];
        }
      });

      // Update messages in chat window if this conversation is selected
      if (selectedConversationRef.current?.id === msg.conversationId) {
        setMessages(prev => [
          ...prev,
          { ...msg, time: new Date(msg.createdAt || msg.time).toLocaleString() },
        ]);
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation) return;

    const msg = {
      conversationId: selectedConversation.id,
      senderId: managerId,
      text: input,
    };

    try {
      const res = await axios.post(`${API_URL}/chat/messages`, msg);
      const messageWithTime = { ...res.data, time: new Date().toLocaleString() };
      socket.emit("sendMessage", messageWithTime);

      setMessages(prev => [...prev, messageWithTime]);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-md shadow-xl border-r border-gray-200 flex flex-col">
        <h2 className="flex items-center gap-2 p-5 text-lg font-semibold text-blue-700 border-b bg-blue-100/60">
          <MessageSquare size={20} /> Conversations
        </h2>
        <ul className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-4 border-b cursor-pointer transition-all ${
                selectedConversation?.id === conv.id
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "hover:bg-blue-50 text-gray-700"
              }`}
            >
              <p className="font-semibold">{conv.clientName}</p>
              <p className="text-xs text-gray-500 truncate">
                {conv.lastMessage || "No messages yet"}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-sm shadow-inner m-4 rounded-2xl overflow-hidden">
        {!selectedConversation ? (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
            Select a conversation to start chatting 💬
          </div>
        ) : (
          <>
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md">
              Chat with <span className="text-yellow-200">{selectedConversation.clientName}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                    msg.senderId === managerId
                      ? "bg-blue-500 text-white ml-auto rounded-br-none"
                      : "bg-gray-200 text-gray-800 mr-auto rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-[10px] block mt-1 opacity-70">{msg.time}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center border-t bg-white px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                onClick={sendMessage}
                className="ml-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition shadow-md"
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
