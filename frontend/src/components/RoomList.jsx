// src/components/RoomList.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function RoomList({ user, onSelectRoom, onLogout }) {
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/rooms`,
        { name: roomName, description: roomDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms([data, ...rooms]);
      setShowCreateModal(false);
      setRoomName("");
      setRoomDescription("");
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (room) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/rooms/${room._id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSelectRoom(room);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Phòng Chat</h1>
            <p className="text-gray-400">Xin chào, {user.username}!</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-secondary hover:bg-primary text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              + Tạo Phòng Mới
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Đăng Xuất
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-dark border border-primary/30 rounded-lg p-6 hover:border-secondary transition duration-200 cursor-pointer"
              onClick={() => handleJoinRoom(room)}
            >
              <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
              <p className="text-gray-400 mb-4 line-clamp-2">
                {room.description || "Không có mô tả"}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Chủ phòng: {room.ownerName}
                </span>
                <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm">
                  {room.members?.length || 0} thành viên
                </span>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">Chưa có phòng chat nào</p>
            <p>Hãy tạo phòng chat đầu tiên!</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-dark border border-primary/30 rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">
              Tạo Phòng Chat Mới
            </h2>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Tên phòng</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full bg-darker border border-primary/30 text-white px-4 py-3 rounded focus:outline-none focus:border-secondary"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Mô tả</label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  className="w-full bg-darker border border-primary/30 text-white px-4 py-3 rounded focus:outline-none focus:border-secondary h-24 resize-none"
                  placeholder="Mô tả về phòng chat..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-secondary hover:bg-primary text-white py-3 rounded font-semibold transition duration-200 disabled:opacity-50"
                >
                  {loading ? "Đang tạo..." : "Tạo Phòng"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold transition duration-200"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
