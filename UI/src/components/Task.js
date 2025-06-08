import React from "react";
import { Card } from "react-bootstrap";
import { useDrag } from "react-dnd";

const Task = ({ task, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={drag}
      className="mb-2 cursor-pointer"
      onClick={() => onClick(task)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        <Card.Text className="text-muted small">
          {task.description.substring(0, 50)}...
        </Card.Text>
        <Card.Text className="small">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Task;
