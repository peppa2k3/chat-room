// src/components/ChatRoom.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

export default function ChatRoom({ room, user, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit("join-room", {
      roomId: room._id,
      userId: user.id,
      username: user.username,
    });

    fetchMessages();

    return () => {
      newSocket.emit("leave-room", {
        roomId: room._id,
        username: user.username,
      });
      newSocket.disconnect();
    };
  }, [room._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);

      if (message.username !== user.username) {
        showNotification(`${message.username} đã gửi tin nhắn`);
        playNotificationSound();
      }
    });

    socket.on("user-joined", ({ username }) => {
      showNotification(`${username} đã tham gia phòng`);
    });

    socket.on("user-left", ({ username }) => {
      showNotification(`${username} đã rời phòng`);
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [socket, user.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${API_URL}/rooms/${room._id}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showNotification = (text) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 3000);
  };

  const playNotificationSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "data:audio/wav;base64,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"
      );
      audioRef.current.volume = 0.3;
    }
    audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    socket.emit("send-message", {
      roomId: room._id,
      userId: user.id,
      username: user.username,
      message: inputMessage.trim(),
    });

    setInputMessage("");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {notification && (
        <div className="fixed top-4 right-4 bg-secondary text-white px-6 py-3 rounded-lg shadow-lg notification-pulse z-50">
          {notification}
        </div>
      )}

      <div className="bg-dark border-b border-primary/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-white hover:text-secondary transition duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-white">{room.name}</h2>
              <p className="text-sm text-gray-400">
                Chủ phòng: {room.ownerName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.username === user.username ? "justify-end" : "justify-start"
              } message-animation`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  msg.username === user.username
                    ? "bg-secondary text-white"
                    : "bg-dark border border-primary/30 text-white"
                }`}
              >
                {msg.username !== user.username && (
                  <p className="text-xs text-gray-400 mb-1">{msg.username}</p>
                )}
                <p className="break-words">{msg.content}</p>
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-dark border-t border-primary/30 p-4">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto flex gap-4"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-darker border border-primary/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-secondary"
          />
          <button
            type="submit"
            className="bg-secondary hover:bg-primary text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
