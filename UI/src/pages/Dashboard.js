import React, { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import TaskColumn from "../components/TaskColumn";
import TaskModal from "../components/TaskModal";
import Chat from "../components/Chat";
import { Button, Container, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  const { tasks, fetchTasks, isAdmin } = useTasks();
  const { currentUser, logout } = useAuth();
  const { joinRoom } = useSocket();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchTasks();
    if (currentUser) {
      joinRoom(currentUser._id);
    }
  }, [fetchTasks, joinRoom, currentUser]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const statuses = ["todo", "in-progress", "completed"];

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h2>Welcome, {currentUser.email}</h2>
          <p>Role: {currentUser.role}</p>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="me-2"
            >
              Create Task
            </Button>
          )}
          <Button
            variant="info"
            onClick={() => setShowChat(!showChat)}
            className="me-2"
          >
            {showChat ? "Hide Chat" : "Show Chat"}
          </Button>
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </Col>
      </Row>

      {showChat && (
        <Row className="mb-3">
          <Col>
            <Chat />
          </Col>
        </Row>
      )}

      <Row>
        {statuses.map((status) => (
          <Col key={status}>
            <TaskColumn
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              onTaskClick={handleTaskClick}
            />
          </Col>
        ))}
      </Row>

      <TaskModal
        show={showModal}
        onHide={handleCloseModal}
        task={selectedTask}
      />
    </Container>
  );
};

export default Dashboard;
