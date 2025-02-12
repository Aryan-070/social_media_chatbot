import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Button, Input, message as antdMessage } from "antd";
import { LogoutOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import 'animate.css';

import aiqwipLogo from '/src/assets/aiqwip.jpg';
const Chatbot = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    
    const token = localStorage.getItem("token");
    const wsUrl = `ws://localhost:8000/ws/chatbot/?username=${encodeURIComponent(
      user?.username
    )}&token=${encodeURIComponent(token)}`;
    
    const ws = new WebSocket(wsUrl);
    

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.conversation_history) {
          // For each conversation record, push two messages:
          // one for the user's message and one for the bot's response.
          const historyMessages = data.conversation_history.reduce(
            (acc, conv) => {
              acc.push({ sender: "user", text: conv.message });
              acc.push({ sender: "bot", text: conv.response });
              return acc;
            },
            []
          );
          // Set the old chat history as the initial messages.
          setMessages(historyMessages);
        } else if (data.message) {
          // If it's a new bot message, append it to the messages array.
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: data.message },
          ]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Save the WebSocket instance in state so we can use it later
    setSocket(ws);

    // Cleanup: Close the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [user, navigate]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && input.trim() !== "") {
      // Send the message as JSON
      socket.send(JSON.stringify({ message: input }));
      // Optionally, add the user's message to the message list immediately
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
      setInput("");
    }
  };

  // Optionally, allow sending the message by pressing "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const sendMessage = () => {
    if (input.trim() && socket && socket.readyState === WebSocket.OPEN) {
      // Add the user's message locally
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
      // Send the message as JSON
      socket.send(JSON.stringify({ message: input }));
      setInput("");
    } else if (!socket || socket.readyState !== WebSocket.OPEN) {
      antdMessage.error("WebSocket is not connected.");
    }
  };

  const handleLogout = () => {
    logout(); // Clear authentication state
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="https://aiqwip.com/"
            style={{ textDecoration: "none", marginLeft: 0, paddingLeft: 0 }}
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src={aiqwipLogo}
              alt="Aiqwip Logo"
              width="80"
              height="40"
              className="mx-auto"
            />
            <span
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                marginLeft: 50,
                background: "linear-gradient(to right, #2563eb, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Social Media Chatbot
            </span>
          </a>
          <div className="flex items-center gap-[10px]">
            <h3 className="text-sm" style={{ color: "#3B82F6" }}>
              Welcome, {user?.username || "Guest"}
            </h3>
            <Button
              type="primary"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
            >
              Log out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {/* Chat Area fixed as Footer */}
        <div
          style={{
            position: "fixed",
            bottom: "5px",
            left: "50px",
            right: "50px",
            background: "linear-gradient(to right, #2563eb, #93c5fd)",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "2px solid #ccc", // Adjust thickness and color as needed
            borderRadius: "0.5rem",    // Applies border radius to all corners
            padding: "20px"
          }}
        >
          {/* Instruction Header */}
          <div
            style={{
              marginBottom: "10px",
              textAlign: "center",
              fontWeight: "bold",
              color: "#ffffff",
              fontSize: "1.25rem"
            }}
          >
            💬 Start chatting with Social Media Chat-Bot🤖 !
          </div>

          {/* Messages Area */}
          <div
            style={{
              width: "100%",
              height: "500px",
              overflowY: "auto",
              padding: "20px",
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              marginBottom: "20px"
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  animation: "fadeIn 0.5s",
                  margin: "10px 0" // Adds vertical spacing between messages
                }}
              >
                <span
                  style={{
                    padding: "12px 16px",
                    borderRadius: "0.5rem",
                    maxWidth: "calc(100% - 32px)",
                    backgroundColor: msg.sender === "user" ? "#3B82F6" : "#e5e7eb",
                    color: msg.sender === "user" ? "#ffffff" : "#000000",
                    transition: "transform 0.3s ease-in-out",
                    cursor: "default",
                    margin: "0 20px" // Adds horizontal margins for the message bubble
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>



          {/* Input Area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "60px",
              borderTop: "1px solid #e5e7eb",
              padding: "0 20px",
              backgroundColor: "#ffffff",
              borderBottomLeftRadius: "0.5rem",
              borderBottomRightRadius: "0.5rem"
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              style={{ flex: 1, marginRight: "20px" }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={sendMessage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;