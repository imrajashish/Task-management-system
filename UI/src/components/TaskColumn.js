import React from "react";
import { Card } from "react-bootstrap";
import Task from "./Task";
import { useDrop } from "react-dnd";
import { useTasks } from "../context/TaskContext";

const statusTitles = {
  todo: "To Do",
  "in-progress": "In Progress",
  completed: "Completed",
};

const TaskColumn = ({ status, tasks, onTaskClick }) => {
  const { moveTask } = useTasks();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Card
      ref={drop}
      className="h-100"
      style={{ backgroundColor: isOver ? "#f8f9fa" : "white" }}
    >
      <Card.Header className="text-center fw-bold">
        {statusTitles[status]} ({tasks.length})
      </Card.Header>
      <Card.Body>
        {tasks.map((task) => (
          <Task key={task._id} task={task} onClick={onTaskClick} />
        ))}
      </Card.Body>
    </Card>
  );
};

export default TaskColumn;
