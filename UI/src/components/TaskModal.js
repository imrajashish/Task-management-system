import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const TaskModal = ({ show, onHide, task }) => {
  const { createTask, updateTask } = useTasks();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "todo",
    assignedTo: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.split("T")[0],
        status: task.status,
        assignedTo: task.assignedTo?._id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        status: "todo",
        assignedTo: "",
      });
    }

    if (currentUser.role === "admin") {
      axios
        .get("http://localhost:5000/api/chat/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setUsers(res.data));
    }
  }, [task, currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await updateTask(task._id, formData);
      } else {
        await createTask(formData);
      }
      onHide();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{task ? "Edit Task" : "Create Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!task && currentUser.role !== "admin"}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
          {currentUser.role === "admin" && (
            <Form.Group className="mb-3">
              <Form.Label>Assign To</Form.Label>
              <Form.Select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email} ({user.role})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Button variant="primary" type="submit">
            {task ? "Update Task" : "Create Task"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskModal;
