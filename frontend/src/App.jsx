// src/App.jsx
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import RoomList from "./components/RoomList";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
      setPage("rooms");
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setPage("rooms");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setSelectedRoom(null);
    setPage("login");
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setPage("chat");
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
    setPage("rooms");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-primary">
      {page === "login" && (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <Register
          onRegister={handleLogin}
          onSwitchToLogin={() => setPage("login")}
        />
      )}

      {page === "rooms" && user && (
        <RoomList
          user={user}
          onSelectRoom={handleSelectRoom}
          onLogout={handleLogout}
        />
      )}

      {page === "chat" && selectedRoom && user && (
        <ChatRoom room={selectedRoom} user={user} onBack={handleBackToRooms} />
      )}
    </div>
  );
}

export default App;
