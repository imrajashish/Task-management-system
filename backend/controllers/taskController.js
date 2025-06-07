const Task = require("../models/Task");
const User = require("../models/User");
const { sendEmail } = require("../config/email");

const getAllTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find()
        .populate("createdBy", "email")
        .populate("assignedTo", "email");
    } else {
      tasks = await Task.find({
        $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
      })
        .populate("createdBy", "email")
        .populate("assignedTo", "email");
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      createdBy: req.user._id,
      assignedTo,
    });

    await task.save();

    // If assigned to someone, notify them
    if (assignedTo && assignedTo !== req.user._id.toString()) {
      const assignee = await User.findById(assignedTo);
      if (assignee) {
        await sendEmail(
          assignee.email,
          "New Task Assigned",
          `You have been assigned a new task: ${title}`
        );
      }
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description", "status", "dueDate"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user is authorized to update this task
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this task" });
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    task.updatedAt = new Date();
    await task.save();

    // If status changed and task was created by admin, notify admin
    if (
      updates.includes("status") &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      const admin = await User.findById(task.createdBy);
      if (admin) {
        await sendEmail(
          admin.email,
          "Task Status Updated",
          `Task "${task.title}" has been updated to status: ${task.status} by ${req.user.email}`
        );
      }
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
