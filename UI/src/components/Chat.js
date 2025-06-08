import React, { useState, useEffect } from "react";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { getChatUsers, getChatMessages, sendChatMessage } from "../utils/api";

const Chat = () => {
  const { currentUser } = useAuth();
  const { messages, sendMessage } = useSocket();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getChatUsers();
      setUsers(data);
      if (data.length > 0) {
        setSelectedUser(data[0]._id);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        const data = await getChatMessages(selectedUser);
        setChatMessages(data);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    setChatMessages((prev) => [...prev, ...messages]);
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      await sendChatMessage(selectedUser, message);
      sendMessage(currentUser._id, selectedUser, message);
      setMessage("");
    }
  };

  return (
    <Card>
      <Card.Header>Chat</Card.Header>
      <Card.Body className="p-0">
        <div className="d-flex" style={{ height: "400px" }}>
          <div style={{ width: "200px", borderRight: "1px solid #dee2e6" }}>
            <ListGroup variant="flush">
              {users.map((user) => (
                <ListGroup.Item
                  key={user._id}
                  action
                  active={selectedUser === user._id}
                  onClick={() => setSelectedUser(user._id)}
                >
                  {user.email} ({user.role})
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <div className="flex-grow-1 d-flex flex-column">
            <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 ${
                    msg.sender === currentUser._id ? "text-end" : "text-start"
                  }`}
                >
                  <div
                    className={`d-inline-block p-2 rounded ${
                      msg.sender === currentUser._id
                        ? "bg-primary text-white"
                        : "bg-light"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <Form onSubmit={handleSendMessage} className="p-3 border-top">
              <div className="d-flex">
                <Form.Control
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button variant="primary" type="submit" className="ms-2">
                  Send
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Chat;
